Meteor.methods
  addBookMark: (options) ->
    Bookmarks.insert
      userId: options.userId
      packageId: options.package_id
      itemId: options.item_id
      logo: options.logo
      item_name: options.item_name
      item_rate_type: options.item_rate_type
      item_lock_in_period: options.item_lock_in_period
      item_package_rates : options.item_package_rates
    options.success = true
    #console.log options
    return options
  checkBookMarkExists: (options) ->
    itemBookMark = Bookmarks.find({ 'packageId': options.package_id }, limit: 1).count() > 0
    if itemBookMark == true
      return true
    else
      return false
  readBookMarks: (options) ->
    console.log options.userId
    itemBookedMarks = Bookmarks.find({"userId": options.userId}).fetch()
    #console.log itemBookedMarks
    return itemBookedMarks
  readUs: (options) ->
    console.log options.userId
    items = Bookmarks.find().fetch({"userId": options.userId})
    console.log items
    return items
  deleteBookMarkedItem: (options) ->
    #console.log options
    Bookmarks.remove({"_id": options.bookMarkedItemId })
    return true