db.createUser({
  user: 'crmuser',
  pwd: 'crmpassword',
  roles: [
    {
      role: 'readWrite',
      db: 'crm',
    },
  ],
});
