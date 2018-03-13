Meteor.methods
  getBankform: (item) ->
    forms = {}

    getLoanType = (loantypes, property_type) ->
      itemsCodes = globals.BankForms.itemCodes
      loantype = {}
      loantypes.map (item,index) ->
        if parseInt(itemsCodes[item].productcode) == parseInt(property_type)
          loantype=item
          # loantype['type']=item
          # loantype['productcode']=itemsCodes[item].productcode
          # loantype['productname']=itemsCodes[item].productname
          # loantype['category']=itemsCodes[item].category
      return loantype

    # items.map (item, index) ->
    bank_name = item.bank_name.replace(/\s/g, '').toLowerCase()
    form_id = item.property_type
    loantype = getLoanType(item.loanType,form_id)
    forms[bank_name] = globals.BankForms.banks[bank_name][loantype]
      # return
    return forms
  addMasterfields: (userID,usedfield) ->
    Masterfields.insert( { _id: userID, usedfield} ) 
  updateMasterfield: (userId,usedfield) ->
    Masterfields.update({_id: userId}, {$set: {"usedfield": usedfield}})
  findOneMasterField: (userID) ->
    return Masterfields.findOne {_id: userID}