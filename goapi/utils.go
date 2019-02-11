package main

import (
	"fmt"
	"reflect"
)

func prettyPrint(t interface{}) {
	s := reflect.ValueOf(t).Elem()
	typeOfT := s.Type()

	for i := 0; i < s.NumField(); i++ {
		f := s.Field(i)
		fmt.Printf("%d: %s %s = %v\n", i,
			typeOfT.Field(i).Name, f.Type(), f.Interface())
	}
}
