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


class UserSaveXBlock(XBlock):

    has_score = True
    weight = 1

    lab_proxy_id = Integer(
        default=0, scope=Scope.settings,
        help="Lab proxy",
    )
    user_id = Integer(default=0, scope=Scope.user_state, help="Lab proxy")

    def post_json(self, url, data=None):
        headers = {'content-type': 'application/json'}
        kwargs = {
            'headers': headers,
        }
        if data:
            kwargs['data'] = json.dumps(data)

        response = requests.post(url, **kwargs)
        return response

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def student_view(self, context=None):
        """
        The primary view of the LabsterLabXBlock, shown to students
        when viewing courses.
        """
        user_save = None
        if self.lab_proxy_id and self.user_id:
            user_save_url = "{}/labster/api/v2/lab-proxies/{}/user-id/{}".format(API_BASE_URL, self.lab_proxy_id, self.user_id)
            user_save = requests.get(user_save_url).json()

        template_context = {
            'user_save': user_save,
        }

        html = render_template("templates/user_save.html", template_context)
        frag = Fragment(html)

        # frag.add_javascript_url(self.runtime.local_resource_url(self, "public/js/labster_lab_lms.js"))

        # frag.initialize_js('LabsterLabXBlock')
        return frag

    @XBlock.json_handler
    def create_user_save(self, data, suffix=''):
        lab_proxy_id = data.get('lab_proxy_id')
        user_id = data.get('user_id')
        save_file = data.get('save_file')

        user_save_url = "{}/labster/api/v2/user-save/".format(API_BASE_URL)
        post_data = {
            'user_id': user_id,
            'save_file': save_file
        }

        if lab_proxy_id:
            post_data['lab_proxy_id'] = lab_proxy_id

        response = self.post_json(user_save_url, post_data)
        response_json = response.json()
        self.lab_proxy_id = int(response_json['id'])
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
