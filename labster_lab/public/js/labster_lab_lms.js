var _host = "localhost:8000";

function LabsterLabXBlock(runtime, element) {

    var _current_problem = -1;
    var _problems = [];

    var lab_proxies_url = "http://" + _host + "/labster/api/v2/lab-proxies/";
    var lab_lms_view = $("#labster_lab_lms_view");
    var lab_proxy_id = lab_lms_view.data("lab-proxy-id");
    var lab_lms_view_template = _.template(
        $("#labster_lab_lms_view_template").html()
    );

    var a_link = lab_lms_view.find(".play-lab-fullscreen");
    a_link.click(function(ev) {
        ev.preventDefault();
        var el = $(ev.currentTarget);
        var unity_block = el.next(".unity-block");
        unity_block.fullScreen(true);
    });

    $(document).bind("fullscreenchange", function() {
        var is_fullscreen = $(document).fullScreen();
        if (is_fullscreen) {
            $(".unity-block").show();
        } else {
            $(".unity-block").hide();
        }
    });

    if (lab_proxy_id) {
        var _url = lab_proxies_url + lab_proxy_id + "/";

        $.ajax({
            type: "GET",
            url: _url,
            success: function(response) {
                response.quiz_blocks = response.quizblocks;
                $.each(response.quiz_blocks, function(index, quiz_block) {
                    $.each(quiz_block.problems, function(index, problem) {
                        problem.quiz_block_id = quiz_block.id;
                        _problems.push(problem);
                    });
                });

                lab_lms_view
                    .empty()
                    .append(lab_lms_view_template({lab_proxy: response}));

                load_next_question();
            }
        });
    }

    var load_next_question = function() {
        _current_problem += 1;

        if (_current_problem < _problems.length) {
            // show next question
            var problem_block = lab_lms_view.find("#labster_lab_problem_block");
            var problem = _problems[_current_problem];
            problem_block.empty().append(problem.content_html);
            problem_block.data("problem-id", problem.id);

            lab_lms_view.find("#labster_lab_problem_form").bind("submit", submit_form);
        } else {
            lab_lms_view.find("#labster_lab_problem_form").empty();
        }
    };

    var submit_form = function(event) {
        event.preventDefault();
        var user_problem_url = "http://" + _host + "/labster/api/v2/user-problem/";

        var form = lab_lms_view.find("#labster_lab_problem_form");
        var button = form.find("button");
        var form_data = form.serializeArray();
        var problem_id = lab_lms_view.find("#labster_lab_problem_block").data("problem-id");
        var answer = null;

        button.prop("disabled", true);

        $.each(form_data, function(index, each) {
            answer = each.value;
        });

        if (answer) {
            var post_data = {
                problem_id: problem_id,
                answer: answer
            };

            $.ajax({
                type: "POST",
                url: user_problem_url,
                data: JSON.stringify(post_data),
                contentType: "application/json",
                dataType: "json",
                success: function(response) {
                    button.prop("disabled", false);
                    if (response.is_correct) {
                        load_next_question();
                    }
                }
            });
        } else {
            button.prop("disabled", false);
        }

        return false;
    };
}
