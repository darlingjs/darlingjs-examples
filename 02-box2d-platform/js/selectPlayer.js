'use strict';
/**
 * Project: darlingjs / GameEngine.
 * Copyright (c) 2013, Eugene-Krevenets
 */

var module = darlingjs.module('selectControlledEntity');

module.$c('selectByKeyboard', {
    'keyCode': 0,
    'onlyOne': true
});

module.$s('selectControlledEntityByKeyboardSystem', {
    _selectorNodes: {},

    $require: ['selectByKeyboard'],

    $added: function() {
        this._target = document.getElementById(this.domId) || document;
        var self = this;
        this._target.addEventListener('keydown', function(e) {
            var $node = self._selectorNodes[e.keyCode];
            if (darlingutil.isUndefined($node)) {
                return;
            }

            self.selectNode($node);
        });
    },

    $addNode: function($node) {
        var selector = $node.selectByKeyboard;
        if ($node.ngSelected) {
            this.selectNode($node);
        } else {
            selector._controlComponent = $node.$remove('ngControlPlatformStyle');
        }

        this._selectorNodes[selector.keyCode] = $node;
    },

    $removeNode: function($node) {
        var selector = $node.selectByKeyboard;
        delete this._selectorNodes[selector.keyCode];
    },

    selectNode: function(value) {
        if (this._selectedNode === value) {
            return;
        }

        if (value) {
            var selector = value.selectByKeyboard;
            var previous = this._selectedNode;
            if (selector.onlyOne && previous) {
                var prevSelector = previous.selectByKeyboard;
                prevSelector._controlComponent = previous.$remove('ngControlPlatformStyle');
                prevSelector._selectedComponent = previous.$remove('ngSelected');
                previous.$add('ngFixedRotation');
            }

            if (!value.$has('ngSelected')) {
                value.$add(selector._controlComponent);
                if (prevSelector._selectedComponent) {
                    value.$add(prevSelector._selectedComponent);
                } else {
                    value.$add('ngSelected');
                }
                selector.selected = true;
                value.$remove('ngFixedRotation');
            }
        }

        this._selectedNode = value;
    },

    _selectedNode: null
});