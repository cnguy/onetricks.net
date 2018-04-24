/*
     Allows us to use <Link /> in multiple files.
     Just make sure to place this at the top of files that need it, for easier use.

     module Router = Router.Router at the top of the files.
 */
module Router = ReRoute.CreateRouter(RouterConfig);