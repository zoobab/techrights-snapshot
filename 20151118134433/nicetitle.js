/* =================================================================================================
* NiceTitles
* 21st January 2004
* http://neo.dzygn.com/code/nicetitles
*
* NiceTitles turns your boring (X)HTML tags into a dynamic experience
*
* Copyright (c) 2003 - 2004 Stuart Langridge, Paul McLanahan, Peter Janes, Brad Choate, Dunstan Orchard, Ethan Marcotte, Mark Wubben
*
* Licensed under MIT - http://www.opensource.org/licenses/mit-license.php
*** Edited slightly by Roy Schestowitz, http://schestowitz.com
==================================================================================================*/

function NiceTitles(sTemplate, nDelay, nStringMaxLength, nMarginX, nMarginY, sContainerID, sClassName){
	var oTimer;
	var isActive = false;
	var sNameSpaceURI = "http://www.w3.org/1999/xhtml";
	
	if(!sTemplate){ sTemplate = "attr(nicetitle)";}
	if(!nDelay || nDelay <= 0){ nDelay = false;}
	if(!nStringMaxLength){ nStringMaxLength = 80; }
	if(!nMarginX){ nMarginX = 15; }
	if(!nMarginY){ nMarginY = 35; }
	if(!sContainerID){ sContainerID = "nicetitlecontainer";}
	if(!sClassName){ sClassName = "nicetitle";}
	nDelay=1;

	var oContainer = document.getElementById(sContainerID);
	if(!oContainer){
		oContainer = document.createElementNS ? document.createElementNS(sNameSpaceURI, "div") : document.createElement("div");
		oContainer.setAttribute("id", sContainerID);
		oContainer.className = sClassName;
		oContainer.style.display = "none";
		document.getElementsByTagName("body").item(0).appendChild(oContainer);
	}
	
	//=====================================================================
	// Method addElements (Public)
	//=====================================================================
	this.addElements = function addElements(collNodes, sAttribute){
		var currentNode, sTitle;
		
		for(var i = 0; i < collNodes.length; i++){
			currentNode = collNodes[i];
		
			sTitle = currentNode.getAttribute(sAttribute);
			if(sTitle){
				currentNode.setAttribute("nicetitle", sTitle);
				currentNode.removeAttribute(sAttribute);
				addEvent(currentNode, 'mouseover', show);
				addEvent(currentNode, 'mouseout', hide);
				addEvent(currentNode, 'focus', show);
				addEvent(currentNode, 'blur', hide);
			}
		}

	}
	
	//=====================================================================
	// Other Methods (All Private)
	//=====================================================================
	function show(e){
		if(isActive){ hide(); }

		var oNode = window.event ? window.event.srcElement : e.currentTarget;
		if(!oNode.getAttribute("nicetitle")){ 
			while(oNode.parentNode){
				oNode = oNode.parentNode; // immediately goes to the parent, thus we can only have element nodes
				if(oNode.getAttribute("nicetitle")){ break;	}
			}
		}

		var sOutput = parseTemplate(oNode);
		setContainerContent(sOutput);
		var oPosition = getPosition(e, oNode);
		oContainer.style.left = oPosition.x;
		oContainer.style.top = oPosition.y;

		if(nDelay){	
			oTimer = setTimeout(function(){oContainer.style.display = "block";}, nDelay);
		} else {
			oContainer.style.display = "block";
		}

		isActive = true;		
		// Let's put this event to a halt before it starts messing things up
		window.event ? window.event.cancelBubble = true : e.stopPropagation();
	}
	
	function hide(){
		clearTimeout(oTimer);
		oContainer.style.display = "none";
		removeContainerContent();
		isActive = false;
	}

	function setContainerContent(sOutput){
		sOutput = sOutput.replace(/&/g, "&amp;");
		if(document.createElementNS && window.DOMParser){
			var oXMLDoc = (new DOMParser()).parseFromString("<root xmlns=\""+sNameSpaceURI+"\">"+sOutput+"</root>", "text/xml");
			var oOutputNode = document.importNode(oXMLDoc.documentElement, true);
			var oChild = oOutputNode.firstChild;
			var nextChild;
			while(oChild){
				nextChild = oChild.nextSibling; // One's the child is appended, the nextSibling reference is gone
				oContainer.appendChild(oChild);
				oChild = nextChild;
			}
		} else {
			oContainer.innerHTML = sOutput;
		}
	}
	
	function removeContainerContent(){
		var oChild = oContainer.firstChild;
		var nextChild;

		if(!oChild){ return; }
		while(oChild){
			nextChild = oChild.nextSibling;
			oContainer.removeChild(oChild);
			oChild =  nextChild;
		}
	}
	
	function getPosition(e, oNode){
		var oViewport = getViewport();
		var oCoords;
		var commonEventInterface = window.event ? window.event : e;

		if(commonEventInterface.type == "focus"){
			oCoords = getNodePosition(oNode);	
			oCoords.x += nMarginX;
			oCoords.y += nMarginY;			
		} else {
			oCoords = { x : commonEventInterface.clientX + oViewport.x + nMarginX, y : commonEventInterface.clientY + oViewport.y + nMarginY};
		}

		oContainer.style.visiblity = "hidden"; // oContainer needs to be displayed before width and height can be retrieved
		oContainer.style.display =  "block";
		var containerWidth = oContainer.offsetWidth;
		var containerHeight = oContainer.offsetHeight;
		oContainer.style.display = "none"; // hide it again
		oContainer.style.visiblity = "visible";

		if(oCoords.x + containerWidth + 10 >= oViewport.width + oViewport.x){
			oCoords.x = oViewport.width + oViewport.x - containerWidth - 10;
		}
		if(oCoords.y + containerHeight + 10 >= oViewport.height + oViewport.y){
			oCoords.y = oViewport.height + oViewport.y - containerHeight - oNode.offsetHeight - 10;
		}

		oCoords.x += "px";
		oCoords.y += "px";

		return oCoords;
	}

	function parseTemplate(oNode){
		var sAttribute, collOptionalAttributes;
		var oFound = {};
		var sResult = sTemplate;
		
		if(sResult.match(/content\(\)/)){
			sResult = sResult.replace(/content\(\)/g, getContentOfNode(oNode));
		}
		
		var collSearch = sResult.split(/attr\(/);
		for(var i = 1; i < collSearch.length; i++){
			sAttribute = collSearch[i].split(")")[0];
			oFound[sAttribute] = oNode.getAttribute(sAttribute);
			if(oFound[sAttribute] && oFound[sAttribute].length > nStringMaxLength){
				oFound[sAttribute] = oFound[sAttribute].substring(0, nStringMaxLength) + "...";
			}
		}
		
		var collOptional = sResult.split("?")
		for(var i = 1; i < collOptional.length; i += 2){
			collOptionalAttributes = collOptional[i].split("attr(");
			for(var j = 1; j < collOptionalAttributes.length; j++){
				sAttribute = collOptionalAttributes[j].split(")")[0];

				if(!oFound[sAttribute]){ sResult = sResult.replace(new RegExp("\\?[^\\?]*attr\\("+sAttribute+"\\)[^\\?]*\\?", "g"), "");	}
			}
		}
		sResult = sResult.replace(/\?/g, "");
		
		for(sAttribute in oFound){
			sResult = sResult.replace("attr\("+sAttribute+"\)", oFound[sAttribute]);
		}
		
		return sResult;
	}	
		
	function getContentOfNode(oNode){
		var sContent = "";
		var oSearch = oNode.firstChild;

		while(oSearch){
			if(oSearch.nodeType == 3){
				sContent += oSearch.nodeValue;
			} else if(oSearch.nodeType == 1 && oSearch.hasChildNodes){
				sContent += getContentOfNode(oSearch);
			}
			oSearch = oSearch.nextSibling
		}

		return sContent;
	}
	
	function getNodePosition(oNode){
		var x = 0;
		var y = 0;

		do {
			if(oNode.offsetLeft){ x += oNode.offsetLeft }
			if(oNode.offsetTop){ y += oNode.offsetTop }
		}	while((oNode = oNode.offsetParent) && !document.all) // IE gets the offset 'right' from the start

		return {x : x, y : y}
	}
	
	// Idea from 13thParallel: http://13thparallel.net/?issue=2002.06&title=viewport
	function getViewport(){
		var width = 0;
		var height = 0;
		var x = 0;
		var y = 0;
		
		if(document.documentElement && document.documentElement.clientWidth){
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
			x = document.documentElement.scrollLeft;
			y = document.documentElement.scrollTop;
		} else if(document.body && document.body.clientWidth){
			width = document.body.clientWidth;
			height = document.body.clientHeight;
			x = document.body.scrollLeft;
			y = document.body.scrollTop;
		}
		// we don't use an else if here, since Opera 7 tends to get the height on the documentElement wrong
		if(window.innerWidth){ 
			width = window.innerWidth - 18;
			height = window.innerHeight - 18;
		}
		
		if(window.pageXOffset){
			x = window.pageXOffset;
			y = window.pageYOffset;
		} else if(window.scrollX){
			x = window.scrollX;
			y = window.scrollY;
		}
		
		return {width : width, height : height, x : x, y : y };		
	}
}

//=====================================================================
// Event Listener
// by Scott Andrew - http://scottandrew.com
// edited by Mark Wubben, <useCapture> is now set to false
//=====================================================================
function addEvent(obj, evType, fn){
	if(obj.addEventListener){
		obj.addEventListener(evType, fn, false); 
		return true;
	} else if (obj.attachEvent){
		var r = obj.attachEvent('on'+evType, fn);
		return r;
	} else {
		return false;
	}
}

//=====================================================================
// Time Since
// by Mark Wubben - http://neo.dzygn.com
//=====================================================================
Date.prototype.toTimeSinceString = function(nLimit, sBetween, sLastBetween){
	if(!nLimit){ nLimit = 2; }
	if(!sBetween){ sBetween = ", "; }
	if(!sLastBetween){ sLastBetween = " and "; }
	if(!Date.prototype.toTimeSinceString._collStructs){
		Date.prototype.toTimeSinceString._collStructs = new Array(
			{seconds: 60 * 60 * 24 * 365, name: "year"},
			{seconds: 60 * 60 * 24 * 30, name: "month"},
			{seconds: 60 * 60 * 24 * 7, name: "week"},
			{seconds: 60 * 60 * 24, name: "day"},
			{seconds: 60 * 60, name: "hour"},
			{seconds: 60, name: "minute"}
		);
	}

	var collStructs = Date.prototype.toTimeSinceString._collStructs;
	var nSecondsRemain = ((new Date).valueOf() - this.valueOf()) / 1000;
	var sReturn = "";
	var nCount = 0;
	var nFloored;

	for(var i = 0; i < collStructs.length && nCount < nLimit; i++){
		nFloored = Math.floor(nSecondsRemain / collStructs[i].seconds);
		if(nFloored > 0){
			if(sReturn.length > 0){
				if(nCount == nLimit - 1 || i == collStructs.length - 1){
					sReturn += sLastBetween;
				} else if(nCount < nLimit && i < collStructs.length){
					sReturn += sBetween;
				}
			}
			sReturn += nFloored + " " + collStructs[i].name;
			if(nFloored > 1){
				sReturn += "s";
			}
			nSecondsRemain -= nFloored * collStructs[i].seconds;
			nCount++;
		}
	}

	return sReturn;
}

//=====================================================================
// Here the default nice titles are created
//=====================================================================
NiceTitles.autoCreation = function(){
	if(!document.getElementsByTagName){ return; }

	function rewriteDateTime(collNodes){
		var nMonth, nDay, nHours, nMinutes, nSeconds, sDateTime, oDate;
		for(var i = 0; i < collNodes.length; i++){
			sDateTime = collNodes[i].getAttribute("datetime");
			if(sDateTime != null || sDateTime != ""){
				nYear = Number(sDateTime.substring(0,4));
				nMonth = Number(sDateTime.substring(5,7)) - 1;
				nDay = Number(sDateTime.substring(8,10));
				nHours = Number(sDateTime.substring(11, 13));
				nMinutes = Number(sDateTime.substring(14,16));
				nSeconds = Number(sDateTime.substring(17,19));
				oDate = new Date(nYear, nMonth, nDay, nHours, nMinutes, nSeconds);
				collNodes[i].setAttribute("nicetime", oDate.toTimeSinceString());
				collNodes[i].setAttribute("gmttime", oDate.toGMTString());
			}
		}

		return collNodes;
	}

	NiceTitles.autoCreated = new Object();

	NiceTitles.autoCreated.anchors = new NiceTitles("<p class=\"titletext\">attr(nicetitle)? <span class=\"accesskey\">[Alt + attr(accesskey)]</span>?</p><p class=\"destination\">URL: attr(href)</p>", 600);
	NiceTitles.autoCreated.inserts = new NiceTitles("<p class=\"titletext\">Added attr(nicetitle) ago</p><p class=\"destination\">Complete timestamp: attr(gmttime)</p>?<p class=\"destination\">Reason: attr(cite)</p>?", 600);
	NiceTitles.autoCreated.deletions = new NiceTitles("<p class=\"titletext\">Deleted attr(nicetitle) ago</p><p class=\"destination\">Complete timestamp: attr(gmttime)</p>?<p class=\"destination\">Reason: attr(cite)</p>?", 600);
	NiceTitles.autoCreated.acronyms = new NiceTitles("<p class=\"titletext\">content(): attr(nicetitle)</p>", 600);	
	NiceTitles.autoCreated.abbreviations = new NiceTitles("<p class=\"titletext\">content(): attr(nicetitle)</p>", 600);	
	
	NiceTitles.autoCreated.anchors.addElements(document.getElementsByTagName("a"), "title");
	NiceTitles.autoCreated.inserts.addElements(rewriteDateTime(document.getElementsByTagName("ins")), "nicetime");
	NiceTitles.autoCreated.deletions.addElements(rewriteDateTime(document.getElementsByTagName("del")), "nicetime");
	NiceTitles.autoCreated.acronyms.addElements(document.getElementsByTagName("acronym"), "title");
	NiceTitles.autoCreated.acronyms.addElements(document.getElementsByTagName("abbr"), "title");	
}

addEvent(window, "load", NiceTitles.autoCreation);
















