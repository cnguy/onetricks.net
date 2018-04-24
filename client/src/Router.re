/*
     Allows us to use <Link /> in multiple files.
     Just make sure to place this at the top of files that need it (for easier use).

     e.g. module Router = Router.Router;
 */
module Router = ReRoute.CreateRouter(RouterConfig);