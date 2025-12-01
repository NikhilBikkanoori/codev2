try {
  console.log('Loading auth route...');
  require('./routes/auth');
  console.log('✓ auth loaded');
  
  console.log('Loading users route...');
  require('./routes/users');
  console.log('✓ users loaded');
  
  console.log('Loading sessions route...');
  require('./routes/sessions');
  console.log('✓ sessions loaded');
  
  console.log('Loading admin route...');
  require('./routes/admin');
  console.log('✓ admin loaded');
  
  console.log('Loading adminData route...');
  require('./routes/adminData');
  console.log('✓ adminData loaded');
  
  console.log('Loading students route...');
  require('./routes/students');
  console.log('✓ students loaded');
  
  console.log('Loading mentors route...');
  require('./routes/mentors');
  console.log('✓ mentors loaded');
  
  console.log('\n✅ All routes loaded successfully!');
} catch (e) {
  console.error('❌ Error loading routes:', e.message);
  console.error(e.stack);
}
