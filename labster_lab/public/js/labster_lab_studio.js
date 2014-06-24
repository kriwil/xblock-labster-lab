function LabsterLabXBlock(runtime, element) {

    var _create_lab_proxy_url,
        _select,
        _lab_proxy_id,
        _quiz_blocks;

    _create_lab_proxy_url = runtime.handlerUrl(element, "create_lab_proxy");

    $(function ($) {
        _select = $("#labster_lab_studio_select");
        _quiz_blocks = $("#labster_lab_quiz_blocks");

        _select.change(function(event) {
            var lab_id = _select.val();
            var lab_id_quiz_blocks = "#labster_lab_" + lab_id + "_quiz_blocks";

            _quiz_blocks.children("div").hide(400, function() {
                $(lab_id_quiz_blocks).show();
            });

            if (lab_id) {
                var post_data = {lab_id: lab_id};
                if (_lab_proxy_id) {
                    post_data['lab_proxy_id'] = _lab_proxy_id;
                }

                $.ajax({
                    type: "POST",
                    url: _create_lab_proxy_url,
                    data: JSON.stringify(post_data),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(response) {
                        _lab_proxy_id = response.id;
                    }
                });
            }
        });
    });
}
