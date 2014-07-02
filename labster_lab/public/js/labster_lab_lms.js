function LabsterLabXBlock(runtime, element) {
    var _current_problem_index,
        _problems,
        _form,
        _submit_button,
        _container,
        _answer_problem_url,
        _completed,
        _completed_container,
        _lab_proxy_id;

    _current_problem_index = -1;
    _problems = null;

    _answer_problem_url = runtime.handlerUrl(element, "answer_problem");
    _update_completed_url = runtime.handlerUrl(element, "update_completed");

    var load_next_problem = function() {
        _current_problem_index += 1;
        _container.empty();

        if (_current_problem_index < _problems.length) {
            var problem = _problems[_current_problem_index];
            _container.append($(problem).html());

        } else {
            _submit_button.hide();
            if (_lab_proxy_id && ! _completed) {
                $.ajax({
                    type: "POST",
                    url: _update_completed_url,
                    data: JSON.stringify({}),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(response) {
                        _form.remove();
                        _completed_container.find("span").text("True");
                    }
                });
            }
        }
    };

    var submit_form = function(event) {
        var form_data,
            answer = null;

        event.preventDefault();
        _submit_button.prop("disabled", true);

        form_data = _form.serializeArray();
        $.each(form_data, function(index, each) {
            answer = each.value;
        });

        if (answer) {
            problem_id = _container.find(".problem-html").data("problem-id");
            var post_data = {
                problem_id: problem_id,
                answer: answer
            };

            $.ajax({
                type: "POST",
                url: _answer_problem_url,
                data: JSON.stringify(post_data),
                contentType: "application/json",
                dataType: "json",
                success: function(response) {
                    _submit_button.prop("disabled", false);

                    if (response.is_correct) {
                        load_next_problem();
                    }
                }
            });

        } else {
            _submit_button.prop("disabled", false);
        }

        return false;
    };

    $(function ($) {

        var update_user_url = runtime.handlerUrl(element, "update_user_id");
        $.get(update_user_url, function(response) {});

        _problems = $("#labster_lab_problem_data").children("div");
        _container = $("#labster_lab_problem_container");
        _form = $("#labster_lab_problem_form");
        _submit_button = $("#labster_lab_problem_submit");
        _completed_container = $("#labster_lab_completed");

        var view = $("#labster_lab_lms_view");
        _lab_proxy_id = view.data("lab-proxy-id");
        _completed = view.data("completed");

        if (! _completed) {
            load_next_problem();
            _form.bind("submit", submit_form);
            _submit_button.show();
        }
    });
}
