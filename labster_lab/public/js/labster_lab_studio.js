function LabsterLabXBlock(runtime, element) {

    var update_lab_url = runtime.handlerUrl(element, "update_lab");
    var labs_url = "http://localhost:8000/labster/api/v2/labs/";
    var lab_proxies_url = "http://localhost:8000/labster/api/v2/lab-proxies/";

    var labs = null;
    var unit_id = $("#unit-location-id-input").val();

    var lab_select = $("#labster_lab_select");
    var lab_select_template = _.template(
        $("#labster_lab_select_template").html()
    );

    var lab_problems = $("#labster_lab_problems");
    var lab_problems_template = _.template(
        $("#labster_lab_problems_template").html()
    );

    var lab_proxy_id = lab_select.data("lab-proxy-id");

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
                    parse_problems(lab_id);
                }
            });
        }

        // create lab_proxy first
        if (parseInt(lab_proxy_id) == 0) {
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

        } else {
            update_lab();
        }

    };

    var parse_labs = function(response) {
        labs = response;

        lab_select
            .empty()
            .append(lab_select_template({labs: labs}));

        var lab_id = lab_select.data("lab-id");

        var select = lab_select.find("select");
        select.bind("change", select_change_handler);
        if (lab_id) {
            select.val(lab_id);
            parse_problems(lab_id);
        }
    }

    var parse_problems = function(lab_id) {
        lab_problems.empty();

        if (lab_id) {
            var lab = _.find(labs, function(item) {
                return item.id == lab_id;
            });

            lab_problems.append(lab_problems_template({lab: lab}));
        }
    }

    $.ajax({
        type: "GET",
        url: labs_url,
        success: parse_labs
    });
}
