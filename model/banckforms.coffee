@Masterfields = new Mongo.Collection('masterfields')

Masterfields.allow
  insert: (userId, formID) ->
    # console.log 'In the insert for action'
    # action._created = new Date()
    # action.creatorID = userId
    # action.formID=formID
    #thing.name_sort = thing.name.toLowerCase()
    true
  update: (userId, action, fields, modifier) ->
    action._modified = new Date()
    action.lastModifiedBy = userId

    #thing.name_sort = thing.name.toLowerCase()
    true
  remove: (userId, action) ->
    true
