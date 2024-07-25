define([
	'../app',
	'views/templateHelpers',
    'underscore',
    'marionette',
    'tpl!../templates/rightModal.html',
	'models/project',
	'views/BaseRowView'
], function (app, templateHelpers, _, Marionette, templ, Project, BaseRowView) {
    'use strict';

    return BaseRowView.extend({
		templateHelpers:templateHelpers,
        template: templ,
        events:{
                        'click .right_model_menu': 'right_model_menu',
                        'click #set_html_editor': 'set_html_editor',
                        'click #set_normal_editor': 'set_normal_editor',
                        'click #update_general_info': 'update_general_info',
                        'keyup .textarea_title': 'field_changed_data',
                        'keyup .description_textarea': 'field_changed_data',
                        'change .color_input_data': 'field_changed_data',
						'change #view_main_on_project_showing': 'field_changed_data',
                        'keyup .who_is_working_input': 'field_changed_data',
                        'click #commentSubmitminiEditView': 'commentSubmitminiEditView',
                        'click #add_task_reccurence_edit_view': 'addTaskRecc',
                        'click #add_task_estimate_edit_view': 'addTaskEstim',
                        'click #add_task_to_edit_view': 'addTaskTo',
                        'click #save_task_edit_view': 'saveTasks',
                        'click #add_task_edit_view': 'addTask',
                        'change #fileToUpload': '_fileChangeEvent',
                        'change #friendAddToEntry': 'friendAddToEntry',
                        'click .friends_remove_one': 'friends_remove_one',
                        'click .projectsUploadFileDialog': 'onprojectsUploadFile',
                        'click .removeTaskOne': 'listenToRemoveTask',
                        'click .delete_files_one': 'delete_files_one',
                        'click #visible_to_all': 'visible_to_all',
                        'click #visible_to_all_edit': 'visible_to_all_edit',
                        'click #visible_to_none': 'visible_to_none',
                        'click #visible_to_none_edit': 'visible_to_none_edit',
                        'click #visible_to_all_comment': 'visible_to_all_comment',
						'click #friends_comments_id': "friends_comments_id",
						'click #friends_publ_id': "friends_publ_id",
						'click #friends_edit_id': "friends_edit_id",
                        'click #visible_to_none_comment_edit': 'visible_to_none_comment_edit',
                        'click .removeComment': 'listenToRemoveComment'
        },
        initialize: function(){
            this.$el.attr("pid", this.model.get('_id'));
            this.model.set('cFriendsOn', '');
            this.model.set('cChooseFriends', '');
            //this.model.set('cFiles',this.renderr());
			this.historyVisible = false;
			this.commentsVisible = false;
			this.tasksVisible = false;
			/*this.listenTo(this.model,'change',function(){
				this.model.set('cFiles',this.renderr());
				this.rerenderTasks();
				this.render();
			}.bind(this));*/
			this.listenTo(this.model,'change',this.rerenderEverything);
			this.listenTo(this.model,'change:view_main',this.triggerViewChange);
        },
        triggerViewChange: function(){
			if(this.model.get('isProject')){
				var v_model = this.model.get("view_main");
				$("#"+v_model).trigger("click");
			}
			if(this.model.get('isHeader')){
				var v_model = this.model.get("view_main");
				$("#"+v_model).trigger("click");
			}
		},
        onRender: function(){
			$("#right_model_data_of").html(this.getEditDialogWindowHtmlRightModal());
			var comm = this.rerenderComments.bind(this);
			comm();
        }
    });
});
