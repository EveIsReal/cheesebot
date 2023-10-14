'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20231011202607 extends Migration {

  async up() {
    this.addSql('create table `flagged_user` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `last_interact` datetime not null, `flagged_since` datetime not null, primary key (`id`));');
  }

}
exports.Migration20231011202607 = Migration20231011202607;
