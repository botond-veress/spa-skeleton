define([],
    function () {

        ko.bindingHandlers.hotkeys = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var handler = typeof valueAccessor() === 'function'
                    ? valueAccessor()
                    : null;

                function keydownHandler(e) {
                    if (handler(e.keyCode || e.which, true)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }

                function keyupHandler(e) {
                    if (handler(e.keyCode || e.which, false)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }

                if (handler) {
                    $(document).bind('keydown', keydownHandler);
                    $(document).bind('keyup', keyupHandler);

                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $(document).unbind('keydown', keydownHandler);
                        $(document).unbind('keyup', keyupHandler);
                    });
                }
            }
        };

        ko.bindingHandlers.validate = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var submit = function () {
                    return function () {
                        var $form = $(element);
                        var entity = ko.toJS(valueAccessor().entity);
                        var validate = entity && typeof entity.validate === 'function'
                            ? entity.validate()
                            : null;
                        $.when(validate).then(function (validated) {
                            if (validated) {
                                var submit = valueAccessor().submit && typeof valueAccessor().submit === 'function'
                                    ? valueAccessor().submit
                                    : null;
                                if (submit) {
                                    var $element = $form.find('button[type=submit]') || $form.find('input[type=submit]');
                                    if ($element && $element.length) {
                                        var text = $element.text();
                                        $element.attr('disabled', 'disabled').text($element.data('loading-text'));

                                        $.when(submit()).always(function () {
                                            $element.removeAttr('disabled').text(text);
                                        });
                                    }
                                }
                            }
                        });
                    };
                };

                ko.bindingHandlers['submit'].init(element, submit, allBindingsAccessor, viewModel, bindingContext);
            }
        };

        ko.bindingHandlers.hidden = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var hidden = !ko.unwrap(valueAccessor());
                ko.bindingHandlers.visible.update(element, function () { return hidden; }, allBindingsAccessor, viewModel, bindingContext);
            }
        };
    }
);