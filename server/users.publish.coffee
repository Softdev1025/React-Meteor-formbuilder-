'use strict'
util = require 'util'
# only release id and profile to frontend
Meteor.publish "users", ->
  userslist = Meteor.users.find({}, {fields: { profile: 1, _id: 1}})
  #console.log 'users.publish userslist' + util.inspect(userslist)
  return userslist
  
Meteor.publish "userData", ->
  user = Meteor.users.find({_id: this.userId})
  #console.log 'users.publish userslist' + util.inspect(userslist)
  return user