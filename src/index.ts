import createApp from '@utils/createApp';

createApp().then((app) => {
  const port = process.env.PORT || 3000;
  console.log(`App starting on ${port}`);
  app.listen(port);
});
