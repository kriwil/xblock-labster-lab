"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer
from xblock.fragment import Fragment


class LabsterLabXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    lab_proxy_id = Integer(
        default=0, scope=Scope.settings,
        help="Lab proxy",
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the LabsterLabXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("static/html/labster_lab.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/labster_lab.css"))
        # frag.add_javascript(self.resource_string("static/js/src/labster_lab.js"))

        frag.add_javascript_url(self.runtime.local_resource_url(self, "public/vendor/underscore-min.js"))
        frag.add_javascript_url(self.runtime.local_resource_url(self, "public/vendor/jquery-fullscreen-min.js"))
        frag.add_javascript_url(self.runtime.local_resource_url(self, "public/js/labster_lab_lms.js"))

        frag.add_resource(self.resource_string("static/html/templates/_lms.html"), "text/html")

        frag.initialize_js('LabsterLabXBlock')
        return frag

    def studio_view(self, context=None):
        html = self.resource_string("static/html/labster_lab_studio.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/labster_lab_studio.css"))

        frag.add_javascript_url(self.runtime.local_resource_url(self, "public/vendor/underscore-min.js"))
        frag.add_javascript_url(self.runtime.local_resource_url(self, "public/js/labster_lab_studio.js"))

        frag.add_resource(self.resource_string("static/html/templates/_studio.html"), "text/html")

        frag.initialize_js('LabsterLabXBlock')
        return frag

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def update_lab_proxy(self, data, suffix=''):
        lab_proxy_id = data.get('lab_proxy_id', 0)

        try:
            lab_proxy_id = int(lab_proxy_id)
        except ValueError:
            lab_proxy_id = 0

        self.lab_proxy_id = lab_proxy_id

        return {
            'lab_proxy_id': self.lab_proxy_id
        }

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
