package main

func (app *app) initializeRoutes() {
	app.Router.HandleFunc("/api/v1/test", app.getThings).Methods("GET")
}
