var data = {
    gridviews: [
        {
            tabs: {
                '1': { //表id
                    label: 'content1',
                    fields: 'content1' //该表显示字段，由datagrid控件显示
                },
                '2': {
                    label: 'content2',
                    fields: 'content2'
                },
                '3': {
                    label: 'content3',
                    fields: 'content3'
                },
                '4': {
                    label: 'content4',
                    fields: 'content4'
                }
            },
            weight: 4
        },
        {
            tabs: {
                '5': {
                    label: 'content5',
                    fields: 'content5'
                },
                '6': {
                    label: 'content6',
                    fields: 'content6'
                },
                '7': {
                    label: 'content7',
                    fields: 'content7'
                },
            },
            weight: 3
        },
        {
            tabs: {
                '8': {
                    label: 'content5',
                    fields: 'content8'
                }
            },
            weight: 1
        }
    ]
};

var options = {
    data: data,
    onBuild: function (fields) { //对应着data.tabs.{key}.fields
        return '';
    },
    onRender: function (obj_pane) { //obj_pane 每个tab下面的content的jquery对象
        return '';
    },
    onGetData: function () {
        return '';
    }
}



;(function ($) {

    //jquery-ui的draggable组件的options
    var _draggableOptions = {

        revert: 'invalid',

        helper: "clone",

        containment: "document",

        cursor: "move"

    };

    var _droppableOptions = {

        accept: ".tab-pane",

        classes: {

            "ui-droppable-active": "custom-state-active"

        },

        drop: function( event, ui ) {

            if ($(event.target).is(ui.draggable.parent())) {
                return;
            }

            //获取tab和tab对应的content
            var source_tab_id = ui.draggable.attr('id');

            var $source_tab = ui.draggable

                .parents('.gridview')

                .find(`a[href="#${source_tab_id}"]`)

                .parent('li');

            var $source_content = ui.draggable;

            var $source_tab_container = $source_tab.parents('.nav-tabs');

            var $source_content_container = $source_content.parents('.tab-content');

            //获取容器
            var $target_tab_container = $(event.target)

                .parent('.gridview')

                .find('.nav-tabs');

            var $target_content_container = $(event.target);

            //将拖动元素和其对应的tab移入容器中。
            $target_tab_container.append($source_tab);

            $target_content_container.append($source_content);

            //如果gridview下面不存在tab元素，移除gridview
            if ($source_tab_container.find('li').length == 0) {
                $source_tab_container.parents('.gridview').remove();
            } else if ($source_tab_container.find('li').length == 1) {
                $source_tab_container.hide();
            } else {
                $source_tab_container.show();
            }

            if ($target_tab_container.find('li').length == 0) {
                $target_tab_container.parents('.gridview').remove();
            } else if ($target_tab_container.find('li').length == 1) {
                $target_tab_container.hide();
            } else {
                $target_tab_container.show();
            }

            //如果content 和tab被移除，则第一个tab设置显示
            $source_tab_container.find('li:first').addClass('active');

            $source_content_container.find('.tab-pane:first').addClass('active in');

            //如果content和tab被移入，则显示移入的tab。
            $target_tab_container.find('li').removeClass('active');

            $target_content_container.find('.tab-panel').removeClass('active');

            $target_tab_container.find('a:last').tab('show');

        }
    };

    var _addDroppableOptions = {

        accept: ".tab-pane",

        classes: {

            "ui-droppable-active": "custom-state-active"

        },

        drop: function( event, ui ) {

            if (ui.draggable.siblings().length <= 1) {
                return;
            }

            var gridviewIndex = _this.data('gridview-index');

            var source_tab_id = ui.draggable.attr('id');

            var $source_tab = ui.draggable

                .parents('.gridview')

                .find(`a[href="#${source_tab_id}"]`)

                .parent('li');

            var $source_content = ui.draggable;

            var $source_tab_container = $source_tab.parents('.nav-tabs');

            var $source_content_container = $source_content.parents('.tab-content');


            _this.append(`

                <div class="gridview">
                
                    <ul id="tab-${gridviewIndex}" class="nav nav-tabs" style="display:none">
    
                    </ul>
                    
                    <div id="tab-content-${gridviewIndex}" class="tab-content">
    
                    </div>
                    
                </div>
            
            `);

            $(`#tab-${gridviewIndex}`).append($source_tab);

            $(`#tab-content-${gridviewIndex}`).append($source_content);

            $(`#tab-content-${gridviewIndex}`).find('.tab-pane').draggable(_draggableOptions);

            $(`#tab-content-${gridviewIndex}`).droppable(_droppableOptions);

            //如果只有一个tab，则隐藏tab，如果没有tab，将gridview移除，否则显示
            if ($source_tab_container.find('li').length == 0) {
                $source_tab_container.parents('.gridview').remove();
            } else if ($source_tab_container.find('li').length == 1) {
                $source_tab_container.hide();
            } else {
                $source_tab_container.show();
            }

            $source_tab_container.find('li:first').addClass('active');

            $source_content_container.find('.tab-pane:first').addClass('active in');

            _this.data('gridview-index', gridviewIndex + 1);

        }

    };

    function init(options) {
        var _this = $(this);

        var settings = $.extend({}, options);

        var gridviews = settings.data.gridviews;

        return this.each(function () {
            for (var i = 0; i < gridviews.length; i++) {

                var tabs_nav = '';

                var tabs_content = '';

                var tabs = gridviews[i].tabs;

                var active = true;

                var tabs_length = 0;

                for (var j in tabs) {

                    var content = '';

                    if (typeof settings.onBuild == 'function') {

                        content = settings.onBuild(tabs[j]);

                    }

                    tabs_nav += `
        
                        <li ${active? 'class="active"': ''} >
        
                            <a href="#tab-${i}-${j}" data-toggle="tab">${tabs[j].label}</a>
        
                        </li>
                        
                    `;

                    tabs_content += `
                    
                        <div class="tab-pane fade in ${active? 'active': ''}" id="tab-${i}-${j}">
        
                            ${content}
        
                        </div>
                    
                    `;

                    active = false;
                    tabs_length++;
                }

                _this.append(`
        
                    <div class="gridview">
                    
                        <ul id="tab-${i}" class="nav nav-tabs "${tabs_length <= 1? 'style="display:none"': ''}>
            
                            ${tabs_nav}
        
                        </ul>
                        
                        <div id="tab-content-${i}" class="tab-content">
        
                            ${tabs_content}
        
                        </div>
                        
                    </div>
                    
                `);

                $(`#tab-content-${i} .tab-pane`).each(function () {

                    if (typeof settings.onBuild == 'function') {

                        content = settings.onBuild($(this));

                    }

                })

            }
            // 记录一下有多少个tab，方便新增tab的时候根据序号命名
            _this.data('gridview-index', i);


            _this.find('.tab-pane').draggable(_draggableOptions);

            //当gridview 中的content拖动到其他的gridview中，将tab和content移动到其他gridview中
            _this.find('.tab-content').droppable(_droppableOptions);

            //增加一个虚线框，当用户将content拖到虚线框之后，生成新的gridview
            _this.after(`
            
                <div class="new-gridview" style="height: 100px; border: 1px dotted grey"></div>
                    
            `);

            _this.next('.new-gridview').droppable(_addDroppableOptions)

            _this.sortable();

        })

    }

    function getData() {

        var data = {};

        data.gridviews = [];

        this.each(function () {

            _this = $(this);

            _this.find('.gridview').each(function () {

                _gridview = $(this);

                var tabs = {};

                _gridview.find('.nav-tabs li a').each(function () {

                    var content_id = $(this).attr('href').split('-')[2];
                    var id = $(this).attr('href');

                    if (typeof settings.onGetData == 'function') {

                        //content = settings.onGetData($(`${id}`));

                    }

                    tabs[content_id] = {

                        'fields': '',
                        'label': $(this).text()
                    }

                })

                data.gridviews.push(tabs);

            })

        })

        console.log(data);

    }


    var methods = {

        init: init,

        getData: getData,

    }


    $.fn.gridview = function (method) {

        if (methods[method]) {

            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        } else if (typeof method === 'object' || !method) {

            return methods.init.apply(this, arguments);

        } else {

            $.error('Method' + method + 'does not exist on jQuery.tooltip');

        }

    }

})(jQuery)

