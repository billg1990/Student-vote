root = global ? window
root.Groups = new Meteor.Collection("groups")

root.groupRule = (userId, doc) ->
  if Meteor.isServer
    return Meteor.call("isGroupAdminOf", doc._id)
  else
    return true

root.Groups.allow(
  update: root.groupRule
  remove: root.groupRule
)

root.Groups.deny(
  update: (userId, doc, fieldNames) ->
    return 'creator' in fieldNames
)

Meteor.methods(
  addGroup: (name, description, admins, netIds=[]) ->
    if Meteor.isServer and !Meteor.call("isAGroupAdmin")
      throw new Meteor.Error(500, "Error: You are not administrator of any group!")
    id = new Meteor.Collection.ObjectID()
    id = id.toHexString()
    Groups.insert(
      _id: id
      name: name
      description: description
      creator: Meteor.user().profile.netId
      admins: admins
      netIds: netIds
    )
    return Groups.findOne({name:name})._id
)