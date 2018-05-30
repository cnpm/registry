'use strict';

/**
 * list all module names by user
 * @param {String} user
 */

exports.listModuleNamesByUser = async user => {
  const rows = await this.findAll({
    attributrs: [ 'name' ],
    where: {
      user,
    },
  });
  return rows.map(row => row.name);
};

/**
 * list all maintainers of module `name`
 * @param {String} name
 */

exports.listMaintainers = async name => {
  const rows = await this.findAll({
    attributrs: [ 'user' ],
    where: {
      name,
    },
  });
  return rows.map(row => row.user);
};

/**
 * add a maintainer for module `name`
 * @param {String} name
 * @param {String} user
 */

exports.addMaintainer = async (name, user) => {
  let row = await this.find({
    where: {
      user,
      name,
    },
  });
  if (!row) {
    row = await this.build({
      user,
      name,
    }).save();
  }
  return row;
};

/**
 * add maintainers for module `name`
 * @param {String} name
 * @param {Array} users
 */

exports.addMaintainers = async (name, users) => {
  return await users.map(user => {
    return this.addMaintainer(name, user);
  });
};

/**
 * remove maintainers for module `name`
 * @param {String} name
 * @param {Array} users
 */

exports.removeMaintainers = async (name, users) => {
  // removeMaintainers(name, oneUserName)
  if (typeof users === 'string') {
    users = [ users ];
  }
  if (users.length === 0) {
    return;
  }
  await this.destroy({
    where: {
      name,
      user: users,
    },
  });
};

/**
 * remove all maintainers for module `name`
 * @param {String} name
 */

exports.removeAllMaintainers = async name => {
  await this.destroy({
    where: {
      name,
    },
  });
};

/**
 * add maintainers to module
 * @param {String} name
 * @param {Array} users
 */

exports.updateMaintainers = async (name, users) => {
  // maintainers should be [username1, username2, ...] format
  // find out the exists maintainers
  // then remove all the users not present and add all the left

  if (users.length === 0) {
    return {
      add: [],
      remove: [],
    };
  }
  const exists = await this.listMaintainers(name);

  // add user which in `users` but do not in `exists`
  const addUsers = users.filter(username => exists.indexOf(username) === -1);

  // remove user which in `exists` by not in `users`
  const removeUsers = exists.filter(username => users.indexOf(username) === -1);

  await [
    this.addMaintainers(name, addUsers),
    this.removeMaintainers(name, removeUsers),
  ];

  return {
    add: addUsers,
    remove: removeUsers,
  };
};
