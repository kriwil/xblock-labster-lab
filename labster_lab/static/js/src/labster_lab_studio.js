function LabsterLabXBlock(runtime, element) {

    $('.labster_lab_problem_toggle', element).click(function(ev) {

        ev.preventDefault();
        var el = $(ev.currentTarget);

        var problems = el.closest('.labster_lab_quizblocks')
            .find('.labster_lab_problems');

        var is_visible = problems.is(':visible');
        if (is_visible) {
            problems.hide();
            el.text('[+]');
        } else {
            problems.show();
            el.text('[-]');
        }
    });

    $(function ($) {
        /* Here's where you'd do things on page load. */
    });
}
