import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import ProcessDefinition from './views/ProcessDefinition.vue'
import ProcessInstance from './views/ProcessInstance.vue'
import Task from './views/Task.vue'
import User from './views/User.vue'
import Group from './views/Group.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/process_definition',
      name: 'ProcessDefinition',
      component: ProcessDefinition
    },
    {
      path: '/process_instance',
      name: 'ProcessInstance',
      component: ProcessInstance
    },
    {
      path: '/task',
      name: 'Task',
      component: Task
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/group',
      name: 'Group',
      component: Group
    }
  ]
})
