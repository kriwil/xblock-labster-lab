function LabsterLabXBlock(runtime, element) {

    var lab_proxies_url = "http://localhost:8000/labster/api/v2/lab-proxies/";
    var lab_lms_view = $("#labster_lab_lms_view");
    var lab_proxy_id = lab_lms_view.data("lab-proxy-id");
    var lab_lms_view_template = _.template(
        $("#labster_lab_lms_view_template").html()
    );

    var _url = lab_proxies_url + lab_proxy_id + "/";
    $.ajax({
        type: "GET",
        url: _url,
        success: function(response) {
            lab_lms_view
                .empty()
                .append(lab_lms_view_template({lab_proxy: response}));
        }
    });

}
