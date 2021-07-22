import Component from '@ember/component';
import Group from "discourse/models/group";

export default Component.extend({
  didInsertElement() {
    const groupNames = settings.groups.split('|');
    let displayedMemberNames = [];

    Group.findAll().then(groups => {
      const filteredGroups = groups.filter(group => {
        return groupNames.includes(group.name) && group.user_count > 0 && group.can_see_members;
      });
      Promise.all(filteredGroups.map(g => g.findMembers(true))).then(() => {
        // Filter our users after they appear in a group (if the show in
        // multiple groups setting is disabled)
        if (!settings.show_user_in_multiple_groups) {
          filteredGroups.forEach(g => {
            g.members = g.members.filter(m => !displayedMemberNames.includes(m.username))
            displayedMemberNames = displayedMemberNames.concat(g.members.map(m => m.username))
          });
        }
        this.set('groups', filteredGroups)
      });
    });
  }
});
