export function executeCollection(...actions) {
    actions.map(action => action())
}

export function executeConditionalCollection(...actionsWithConditionals) {
    actionsWithConditionals.map(actionWithConditional => {
        if (typeof actionWithConditional === 'object') {
            if (actionWithConditional.cond) {
                return actionWithConditional.onTrue()
            }
            if (actionWithConditional.onFalse) {
                return actionWithConditional.onFalse()
            }
        }
        if (typeof actionWithConditional === 'function') {
            return actionWithConditional()
        }
        return actionWithConditional
    })
}
