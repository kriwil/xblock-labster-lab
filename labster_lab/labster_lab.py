import json
import pkg_resources
import requests
import urllib

from webob import Response
from xblock.core import XBlock
from xblock.fields import Scope, Integer
from xblock.fragment import Fragment

from .utils import render_template


API_BASE_URL = "http://localhost:8000"
LAB_PROXY_URL = "{}/labster/api/v2/lab-proxies/".format(API_BASE_URL)
LAB_URL = "{}/labster/api/v2/labs/".format(API_BASE_URL)
USER_LAB_PROXY_URL = "{}/labster/api/v2/user-lab-proxy/".format(API_BASE_URL)
USER_PROBLEM_URL = "{}/labster/api/v2/user-problem/".format(API_BASE_URL)


class LabsterLabXBlock(XBlock):

    has_score = True
    weight = 1

    lab_proxy_id = Integer(
        default=0, scope=Scope.settings,
        help="Lab proxy",
    )
    user_id = Integer(default=0, scope=Scope.user_state, help="user id")

    def get_user_id(self):
        if not self.user_id:
            self.user_id = self.scope_ids.user_id
        return self.user_id

    def get_completed(self):
        if self.lab_proxy_id:
            user_id = self.get_user_id()
            params = {
                'user_id': user_id,
                'lab_proxy_id': self.lab_proxy_id,
            }
            url = "{}?{}".format(USER_LAB_PROXY_URL, urllib.urlencode(params))
            response = requests.get(url)
            if response.status_code == 200:
                return response.json()['completed']

        return False

    def post_json(self, url, data=None):
        headers = {'content-type': 'application/json'}
        kwargs = {
            'headers': headers,
        }
        if data:
            kwargs['data'] = json.dumps(data)

        response = requests.post(url, **kwargs)
        return response

    def publish_grade(self, score):
        # this is total score for the whole xblock
        grade = {
            'score': score,
            'total': 1,
        }

        self.runtime.publish(
            self,
            'grade',
            {
                'value': grade['score'],
                'max_value': grade['total'],
            }
        )

        return score

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def student_view(self, context=None):
        """
        The primary view of the LabsterLabXBlock, shown to students
        when viewing courses.
        """
        lab_proxy = None
        if self.lab_proxy_id:
            lab_proxy_url = "{}{}/".format(LAB_PROXY_URL, self.lab_proxy_id)
            lab_proxy = requests.get(lab_proxy_url).json()

        template_context = {
            'completed': self.get_completed(),
            'lab_proxy': lab_proxy,
        }

        html = render_template("templates/lab_lms.html", template_context)
        frag = Fragment(html)

        frag.add_javascript_url(self.runtime.local_resource_url(self, "public/js/labster_lab_lms.js"))

        frag.initialize_js('LabsterLabXBlock')
        return frag

    def studio_view(self, context=None):
        template_context = {'lab_proxy_id': self.lab_proxy_id}

        if not self.lab_proxy_id:
            # fetch the proxies
            labs = requests.get(LAB_URL).json()

            template_context.update({
                'labs': labs,
            })

        else:
            lab_proxy_url = "{}{}/".format(LAB_PROXY_URL, self.lab_proxy_id)
            lab_proxy = requests.get(lab_proxy_url).json()

            template_context.update({
                'lab_proxy': lab_proxy,
            })

        html = render_template("templates/lab_studio.html", template_context)
        frag = Fragment(html)
        frag.add_javascript_url(self.runtime.local_resource_url(self, "public/js/labster_lab_studio.js"))

        frag.initialize_js('LabsterLabXBlock')
        return frag

    @XBlock.handler
    def update_user_id(self, request, suffix=''):
        user_id = request._request.user.id
        self.user_id = user_id
        response_data = json.dumps({'user_id': user_id})
        return Response(response_data, content_type='application/json')

    @XBlock.json_handler
    def create_lab_proxy(self, data, suffix=''):
        lab_id = data.get('lab_id')
        lab_proxy_id = data.get('lab_proxy_id')
        location_id = self.location.url()

        post_data = {
            'lab_id': lab_id,
            'location_id': location_id,
        }

        if (lab_proxy_id):
            post_data['lab_proxy_id'] = lab_proxy_id

        response = self.post_json(LAB_PROXY_URL, post_data)
        response_json = response.json()
        self.lab_proxy_id = int(response_json['id'])
        return response_json

    @XBlock.json_handler
    def update_completed(self, data, suffix=''):
        user_id = self.get_user_id()
        post_data = {
            'lab_proxy_id': self.lab_proxy_id,
            'user_id': user_id,
            'completed': True,
        }

        self.post_json(USER_LAB_PROXY_URL, post_data)
        return {'completed': post_data['completed']}

    @XBlock.json_handler
    def answer_problem(self, data, suffix=''):
        user_id = self.get_user_id()
        problem_id = data.get('problem_id')
        answer = data.get('answer')

        post_data = {
            'problem_id': problem_id,
            'user_id': user_id,
            'answer': answer,
        }
        response = self.post_json(USER_PROBLEM_URL, post_data)
        response_json = response.json()
        score = response_json['score']
        self.publish_grade(score)
        return response_json

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("LabsterLabXBlock",
             """<vertical_demo>
                <labster_lab/>
                <labster_lab/>
                <labster_lab/>
                </vertical_demo>
             """),
        ]
