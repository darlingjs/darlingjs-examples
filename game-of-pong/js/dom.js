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

        $added: function() {
            this.stageElement = document.querySelector(this.target);
            if (!this.stageElement) {
                throw new Error('can\'t find ' + id + ' as stage for dom renderer')
            }

            this.stageElement.style.backgroundColor = this.backgroundColor;
            this.stageElement.style.width = this.width + 'px';
            this.stageElement.style.height = this.height + 'px';
            this.stageElement.style.margin = '0 auto';
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
            updatePositionWebKit(element, $entity.ng2D, $entity.ng2DSize);
            domView.element = element;
        }],

        $removeEntity: ['$entity', function($entity) {
            var domView = $entity.domView;
            this.stageElement.removeChild(domView.element);
            domView.element = null;
        }],

        $update: ['$entity', function($entity) {
            updatePositionWebKit($entity.domView.element, $entity.ng2D, $entity.ng2DSize);
        }]
    });

    /**
     * Update position of DOM element in WebKit style
     * @param element
     * @param ng2D
     */
    function updatePositionWebKit(element, ng2D, ng2DSize) {
        element.style['webkitTransform'] = 'translate3d('
                + ~~(ng2D.x - 0.5 * ng2DSize.width) + 'px, '
                + ~~(ng2D.y - 0.5 * ng2DSize.height) + 'px, 0)';
    }
})();