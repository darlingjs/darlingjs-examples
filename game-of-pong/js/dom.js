/**
 * Dom Renderer Module
 */

(function() {
    'use strict';

    //create DOM module
    var m = darlingjs.module('domModule', []);

    /**
     * DOM component
     */
    m.$c('domView', {
        //color of DOM element
        color: null,

        //element for temporary storing
        element: null
    });

    /**
     * System that renderer entity into the DOM
     */
    m.$system('domViewRenderer', {

        //for with entity that holds:
        $require: ['ng2D', 'ng2DSize', 'domView'],

        target: null,

        width: 400,
        height: 300,

        backgroundColor: 'rgb(0,0,0)',

        //@private
        stageElement: null,

        //@private
        updatePosition: null,

        /**
         * System added to the World
         */
        $added: function() {
            this.stageElement = document.querySelector(this.target);
            if (!this.stageElement) {
                throw new Error('can\'t find ' + id + ' as stage for dom renderer')
            }

            //fit stage DIV element to the size
            this.stageElement.style.backgroundColor = this.backgroundColor;
            this.stageElement.style.width = this.width + 'px';
            this.stageElement.style.height = this.height + 'px';
            this.stageElement.style.margin = '0 auto';

            this.updatePosition = buildUpdatePosition(getVendorPrefix());
        },

        /**
         * System removed from the World
         */
        $removed: function() {
            this.stageElement = null;
        },

        /**
         * Add new entity to the System
         */
        $addEntity: ['$entity', function($entity) {
            var domView = $entity.domView,
                ng2DSize = $entity.ng2DSize;

            //create DIV for each entity
            var element = document.createElement('div');

            element.style.backgroundColor = domView.color;
            element.style.width = ng2DSize.width + 'px';
            element.style.height = ng2DSize.height + 'px';

            element.style.position = 'absolute';

            this.stageElement.appendChild(element);
            this.updatePosition(element, $entity.ng2D, $entity.ng2DSize);
            domView.element = element;
        }],

        /**
         * Remove entity from the System
         */
        $removeEntity: ['$entity', function($entity) {
            var domView = $entity.domView;
            this.stageElement.removeChild(domView.element);
            domView.element = null;
        }],

        /**
         * Update position of DIV elements each tick
         */
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