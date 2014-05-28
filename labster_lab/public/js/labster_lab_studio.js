function LabsterLabXBlock(runtime, element) {

    var select_lab_url = runtime.handlerUrl(element, "select_lab");

    var labs = null;
    var labs_url = "http://localhost:8000/labster/api/v2/labs/";

    var lab_select = $("#labster_lab_select");
    var lab_select_template = _.template(
        $("#labster_lab_select_template").html()
    );

    var lab_problems = $("#labster_lab_problems");
    var lab_problems_template = _.template(
        $("#labster_lab_problems_template").html()
    );

    var select_change_handler = function(ev) {
        var el = $(ev.currentTarget);
        var id = el.val();

        $.ajax({
            type: "POST",
            url: select_lab_url,
            data: JSON.stringify({"lab_id": id}),
            success: function(response) {
                parse_problems(id);
            }
        });
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
