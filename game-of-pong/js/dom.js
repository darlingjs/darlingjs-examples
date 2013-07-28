/**
 * Dom Renderer Module
 */

(function() {
    'use strict';

    var m = darlingjs.module('domModule', []);


    m.$c('domView', {
        color: null,
        element: null
    });

    m.$system('domViewRenderer', {
        target: null,
        width: 400,
        height: 300,
        backgroundColor: 'rgb(0,0,0)',
        stageElement: null,

        $require: ['ng2D', 'ng2DSize', 'domView'],

        updatePosition: null,

        $added: function() {
            this.stageElement = document.querySelector(this.target);
            if (!this.stageElement) {
                throw new Error('can\'t find ' + id + ' as stage for dom renderer')
            }

            this.stageElement.style.backgroundColor = this.backgroundColor;
            this.stageElement.style.width = this.width + 'px';
            this.stageElement.style.height = this.height + 'px';
            this.stageElement.style.margin = '0 auto';
            this.updatePosition = buildUpdatePosition(getVendorPrefix());
        },

        $removed: function() {
            this.stageElement = null;
        },

        $addEntity: ['$entity', function($entity) {
            var domView = $entity.domView,
                ng2DSize = $entity.ng2DSize;

            var element = document.createElement('div');

            element.style.backgroundColor = domView.color;
            element.style.width = ng2DSize.width + 'px';
            element.style.height = ng2DSize.height + 'px';

            element.style.position = 'absolute';

            this.stageElement.appendChild(element);
            this.updatePosition(element, $entity.ng2D, $entity.ng2DSize);
            domView.element = element;
        }],

        $removeEntity: ['$entity', function($entity) {
            var domView = $entity.domView;
            this.stageElement.removeChild(domView.element);
            domView.element = null;
        }],

        $update: ['$entity', function($entity) {
            this.updatePosition($entity.domView.element, $entity.ng2D, $entity.ng2DSize);
        }]
    });

    /**
     * Get Vendor Prefix. Based on CraftyJS <http://craftyjs.com>
     * @returns {*}
     */
    function getVendorPrefix() {
        var ua = navigator.userAgent.toLowerCase(),
            match = /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
                /(ms)ie ([\w.]+)/.exec(ua) ||
                /(moz)illa(?:.*? rv:([\w.]+))?/.exec(ua) || [],
            prefix = (match[1] || match[0]);

        //browser specific quirks
        if (prefix === "moz") prefix = "Moz";
        if (prefix === "o") prefix = "O";
        return prefix;
    }

    /**
     * Update position of DOM element in WebKit style
     * @param element
     * @param ng2D
     */
    function buildUpdatePosition(prefix) {
        var property = prefix + 'Transform';
        return function (element, ng2D, ng2DSize) {
            element.style[property] = 'translate3d('
                    + ~~(ng2D.x - 0.5 * ng2DSize.width) + 'px, '
                    + ~~(ng2D.y - 0.5 * ng2DSize.height) + 'px, 0)';
        }
    }
})();