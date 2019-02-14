package main

type role int

const (
	top        role = iota
	jungle     role = iota
	mid        role = iota
	botCarry   role = iota
	botSupport role = iota
)

func (role role) isIn(roles []role) bool {
	for _, r := range roles {
		if r == role {
			return true
		}
	}
	return false
}
