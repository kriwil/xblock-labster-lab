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

/*
function LabsterLabXBlock(runtime, element) {

    var _host = "localhost";

    var update_lab_url = runtime.handlerUrl(element, "update_lab_proxy");
    var labs_url = "http://" + _host + ":8000/labster/api/v2/labs/";
    var lab_proxies_url = "http://" + _host + ":8000/labster/api/v2/lab-proxies/";

    var labs = null;
    var unit_id = $("#unit-location-id-input").val();

    var lab_select = $("#labster_lab_select");
    var lab_select_template = _.template(
        $("#labster_lab_select_template").html()
    );

    var lab_display_template = _.template(
        $("#labster_lab_display_template").html()
    );

    var lab_problems = $("#labster_lab_problems");
    var lab_problems_template = _.template(
        $("#labster_lab_problems_template").html()
    );

    var lab_proxy_id = lab_select.data("lab-proxy-id");
    var lab_proxy_available = false;
    if (lab_proxy_id && parseInt(lab_proxy_id) != 0) {
        lab_proxy_available = true;
    }

    var select_change_handler = function(ev) {
        var el = $(ev.currentTarget);
        var lab_id = el.val();

        var update_lab = function() {
            var post_data = {
                "lab_id": lab_id,
                "lab_proxy_id": lab_proxy_id
            };
            $.ajax({
                type: "POST",
                url: update_lab_url,
                data: JSON.stringify(post_data),
                success: function(response) {
                    var lab = _.find(labs, function(item) {
                        return item.id == lab_id;
                    });
                    parse_problems(lab.quizblocks);
                }
            });
        }

        var post_data = {
            "lab_proxy_id": lab_proxy_id,
            "lab_id": lab_id,
            "unit_id": unit_id
        };
        $.ajax({
            type: "POST",
            url: lab_proxies_url,
            data: JSON.stringify(post_data),
            contentType: "application/json",
            dataType: "json",
            success: function(response) {
                lab_proxy_id = response.id;
                update_lab();
            }
        });

    };

    var parse_labs = function(response) {
        labs = response;
        lab_select.empty();

        // if lab proxy is already available, do not show select dropdown
        if (lab_proxy_available) {
            var lab = response.lab;
            var quizblocks = response.quizblocks;

            lab_select.append(lab_display_template({lab: lab}));
            parse_problems(quizblocks);

        } else {
            lab_select.append(lab_select_template({labs: labs}));

            var select = lab_select.find("select");
            select.bind("change", select_change_handler);
        }
    }

    var parse_problems = function(quizblocks) {
        lab_problems.empty();
        lab_problems.append(lab_problems_template({quizblocks: quizblocks}));
    }

    if (lab_proxy_available) {
        var _url = lab_proxies_url + lab_proxy_id + "/";
        $.ajax({
            type: "GET",
            url: _url,
            success: parse_labs
        });

    } else {
        $.ajax({
            type: "GET",
            url: labs_url,
            success: parse_labs
        });
    }
}
*/
