define [], () ->
	
	if window? and not window.R?
		window.R = {}

	R = window?.R or {}
	R.offline = false
	# R.DajaxiceXMLHttpRequest = window.XMLHttpRequest

	R.canvasWidth = 1000
	R.canvasHeight = 1000
	R.administrator = false
	
	return R