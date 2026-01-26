-- Update the specific user to be an admin
update profiles
set role = 'admin'
where email = 'spreadlellc@gmail.com';

-- Verify the change
select email, role, full_name from profiles where email = 'spreadlellc@gmail.com';
