currentItem = prj;
currentItemStack.push(prj);

// SCRIPT
currentItemStack.push(currentItem);


//---- get choosen options ----
var createJavaDocsTags = Boolean(getArgument("Create JavaDoc tags") == "true");
var stubCode = Boolean(getArgument("Add stub code") == "true");
var copyrightHolder = getArgument("Copyright");
var authorName = getArgument("Author");	

var returnObjStr = "_r";

//---- get arrays ----
// Get Attributes Array
function __getAttributesArr(oMethodContainer,isForClass) {
	var vItemArr = new Array();	
	var vItemCount = oMethodContainer.MOF_GetCollectionCount("Attributes");
	for(var j=0;j<vItemCount;j++) 
		vItemArr.push(__getAttributeDefStr(oMethodContainer.MOF_GetCollectionItem("Attributes",j),isForClass));
	return(vItemArr);
}

// Get Methods Array
function getAllMethods(oMethodContainer,isForClass,isForInterface) {
	var vItemArr = new Array();
	var vItemCount = oMethodContainer.MOF_GetCollectionCount("Operations");
	for(var j=0;j<vItemCount;j++){
		var method = oMethodContainer.MOF_GetCollectionItem("Operations",j);
		var methodDefStr = __getMethodDefStr(method,isForClass,isForInterface);
		vItemArr.push(methodDefStr);	
	}
	return(vItemArr);
}


// Get Methods Parameters Array
function __getMethodParamArr(oMethod, isForClass) {
	var vItemArr = {'in' : null, 'return' : null, 'inDoc' : null};
	vItemArr['in'] = new Array();
	vItemArr['return'] = new Array();
	vItemArr['inDoc'] = new Array();
	
	var vItemCount = oMethod.MOF_GetCollectionCount("Parameters");
	var oItem=null;
	var vDirection=null;
	for(var j=0;j<vItemCount;j++) 
	{
		oItem=oMethod.MOF_GetCollectionItem("Parameters",j);
		vDirection=oItem.MOF_GetAttribute("DirectionKind");
		if(vDirection!='pdkReturn'){
		 vItemArr['in'].push(__getMethodParamDefStr(oItem,isForClass));
		 
		  vItemArr['inDoc'].push(oItem.MOF_GetAttribute("Documentation"));
		 
		  }		 
		else{
		vItemArr['return'].push(__getMethodParamDefStr(oItem,isForClass));
		 }
		oItem=null;
		vDirection=null;
	}				
	return(vItemArr);
}


//PROPERTY
// Get Attribute   Definition String
function __getAttributeDefStr(oAttribute, isForClass)
{
	var vStrDoc = '',vStrName='',vStrType='', vStrValue='',vStrVis='';
	
	vStrVis =		getVisibility(oAttribute.Visibility);
	vStrName = 		__getNameStr(oAttribute,isForClass,true);
	vStrType = 		__getTypeExpressionStr(oAttribute);
	vStrDoc = 		createJavaDoc(oAttribute.Documentation+"\n@property {"+vStrType.substring(vStrType.indexOf(":")+1)+"} "+vStrName+"","\t",vStrVis);

	vStrValue = 	__getInitialValueStr(oAttribute,isForClass,false);

    if(vStrValue == "") vStrValue = " : null"
	
    var atDefStr = "";
	if(vStrVis == "public") atDefStr = returnObjStr+".";
	else{
	 atDefStr = "var ";
	 }

	atDefStr += vStrName+vStrValue.replace(":","=")+';';
	atDefStr = atDefStr.replace(/\s{2,}/g," ");
	return vStrDoc+"\n\t"+atDefStr;
}


//METHOD
// Get method Definition string
function __getMethodDefStr(oMethod, isForClass,isForInterface)
{
	var vStrDoc,vStrName,vInParamStr,vHeaderStr, vBodyStr, vParamArr,vStrVis;
	
	vStrVis =		getVisibility(oMethod.Visibility);
	vStrName = 		__getNameStr(oMethod,isForClass,false);
	vParamArr =		__getMethodParamArr(oMethod, isForClass);

	vInParamStr= "";

	for(var i=0;i<vParamArr['in'].length;i++){
		vInParamStr += vParamArr['in'][i].substring(0,vParamArr['in'][i].indexOf(":"));//
		if(i < (vParamArr['in'].length-1) ) vInParamStr +=  ", ";
	}
	
	vReturnParamStr=vParamArr['return'].join(',');
	if(vReturnParamStr == "") vReturnParamStr = ":void";
	
	var javaDocTags = "\n@method "+vStrName;
	
	if(createJavaDocsTags){
	    for(var i=0;i<vParamArr['in'].length;i++){
        var vStrType = vParamArr['in'][i];
		    var paramText = vStrType.substring(0,vParamArr['in'][i].indexOf(":"));
		    javaDocTags +="\n@param  {"+vStrType.substring(vStrType.indexOf(":")+1)+"} "+paramText+ " ";
		    if(vParamArr['inDoc'][i]) javaDocTags += vParamArr['inDoc'][i];
	    }
	
        if(vReturnParamStr != ":void") javaDocTags += "\n@return "+"";	
	}
		
	vStrDoc = 	createJavaDoc((oMethod.Documentation+javaDocTags),"\t",vStrVis);
	
	var vHeaderStr = "";
	if(vStrVis == "public") vHeaderStr = returnObjStr+".";
	else vHeaderStr = "var ";
	vHeaderStr += vStrName+' = function('+vInParamStr+')'
	
	vHeaderStr = vHeaderStr.replace(/\s{2,}/g," ");
	vHeaderStr = vHeaderStr.replace(/(^\s*)/, "");
	vHeaderStr = "\n\t"+vHeaderStr;
	
	if(!isForClass){
		vBodyStr='';
	}else{			
		vBodyStr = "{";		
		vBodyStr += "\n\t\t";
		
		var traceParamText = "";
		if(vParamArr['in'].length>0) traceParamText = " + \" with the following parameters:\"";
		for(var i=0;i<vParamArr['in'].length;i++){
	 traceParamText += " + \" "+vParamArr['in'][i].substring(0,vParamArr['in'][i].indexOf(":")) + ":\" + "+vParamArr['in'][i].substring(0,vParamArr['in'][i].indexOf(":")) 
	}
	if(stubCode){
		vBodyStr += "\n\t\t//Stub code - to be removed";
		vBodyStr += "\n\t\talert(\"the function '"+vStrName+"' has been called  \""+traceParamText+")";
		}
				
		vBodyStr += "\n\t\t";
		if(vReturnParamStr != ":void") vBodyStr += "\n\t\treturn "+vReturnParamStr.replace(":","new ")+"();";
		
		vBodyStr += "\n\t}";
	} 
	return vStrDoc+vHeaderStr+vBodyStr;
}


function __getMethodParamDefStr(oParam, isForClass) {	
	var vStrType='',vStrName='', vStrValue;		
	
	vStrName = 	oParam.MOF_GetAttribute("Name");
	vStrType = 	__getTypeExpressionStr(oParam);
	vStrValue = __getInitialValueStr(oParam,isForClass,true);
	
	return vStrName+vStrType+vStrValue ;
}

// ---- Get strings ----

//Get attributes name string
function __getNameStr(oAttribute, isForClass, isAttribute){
	var name = 			oAttribute.MOF_GetAttribute("Name");
	var regExp = 		/(static |override |const |var |final |abstract |\s*)*([\w]+)/gi;
    	
	//Delete keywords from name
	var newName = name.replace(regExp, "$2");
	return newName;
}

// Get typeExpression string
function __getTypeExpressionStr(owner){
	var vStrType = "";
	try{
		vStrType=owner.MOF_GetAttribute("TypeExpression");
		if(vStrType == "") vStrType = "*";
		vStrType = ":"+vStrType;
	}catch(e){
		
	}
	return vStrType;
}

// Get initial value / defaultvalue string
function __getInitialValueStr(owner,isForClass,isParam){
	var vStrValue = "";
	if(!isForClass) return vStrValue;
	
	if(isParam){
		vStrValue = owner.defaultValue;
		if(vStrValue != "") vStrValue = " : "+vStrValue;
	}else{
		vStrValue = owner.initialValue; 
		if(vStrValue != "") vStrValue = " : \t"+vStrValue;
	}
	
	return vStrValue;
}


// Get visibility string - public or private
function getVisibility(vCode) {
	var vVis="";
	switch(vCode.toString()) {
		case 'vkPublic':
		case '0':
			vVis="public"; 
			break;
		case '1' : 
		case '2'   :
		case 'vkProtected':
		case 'vkPrivate'   :  
			vVis="private" ;
			break;
		case 'vkPackage'   :
			vVis="package";
			break;
		default: 
			vVis="public";
			break;
	}
	return vVis;
}

function getSuperClass(oParentUMLClass){
	var superClassStr = "";
	if(oParentUMLClass!=null){
		superClassStr = oParentUMLClass.Name;
	} 
	return superClassStr ;
}

function PHPClassDefinition(pUMLClass) {
	var oUMLClass = pUMLClass;
	var oParentUMLClass = null;
	var vImplInterfacesArr=new Array();
	
	var vAtrArr=			__getAttributesArr(pUMLClass,true);
	var vOprArr=			getAllMethods(oUMLClass, true,false);
    
	
	this.getDefinition = function() {

		var vPackagesStr = 		fixPackageStr(oUMLClass.Namespace.Pathname);
		var vNameStr =  		__getNameStr(oUMLClass, true, false);
		var vDefStr="";        
		var vSuperClassStr =	getSuperClass(oParentUMLClass);

		vDefStr +=	"/**\n*@namespace "+vPackagesStr+"\n*/";
		vDefStr +=	"\n";
		
		vDefStr +=	"\n";
		if(createJavaDocsTags){
		var date = new Date()
		vDefStr += 	createJavaDoc(oUMLClass.Documentation+"\n\n@author "+authorName+"\n@created "+date.getDate() +"/"+(date.getMonth()+1)+"/"+date.getYear()+"\n@copyright "+copyrightHolder+"\n@todo \n@class "+ vNameStr+"\n@static","");
		vDefStr += "\n";
		}
		
		vDefStr += "var "+vNameStr+" = "+vNameStr+" || (function () {\n\"use strict\"\n";	
		if(vSuperClassStr == "") vSuperClassStr = "Object"
		else{
		vDefStr += "\n\tif(window['"+vSuperClassStr+"'] == null || window['"+vSuperClassStr+"'] == undefined) {\n\t\tthrow(new Error('"+vNameStr+" relies on "+vSuperClassStr+" which cant be found. Please add it to the html (before "+vNameStr+").'));\n\t\treturn null;\n\t}\n"
		}
		vDefStr += "\n\tvar "+returnObjStr+" = new "+vSuperClassStr+"();";

		// Attributes/properties
		for(var j=0;j<vAtrArr.length;j++) vDefStr+=vAtrArr[j];
		vDefStr += "\n\t\t";

		
		// Operators/methods
		for(var j=0;j<vOprArr.length;j++) vDefStr+=vOprArr[j];	
		vDefStr += "\n\t\t";

	
		vDefStr += "\n\treturn "+returnObjStr+";";
		vDefStr += "\n})();\n";
	
		return(vDefStr);		
	};

    this.setParentClass = function(pUMLClass) {
		oParentUMLClass=pUMLClass;
		return;
	}

	this.addImplementedInterface = function(pUMLInterface) {
		vImplInterfacesArr.push(pUMLInterface);
		return;
	}
	

}

function fixPackageStr(str){
    str = str.split("::Design Model::").join("").split("::Design Model").join("");
    return str;
};


function fixFolderStr(str){
    str = str.split("::Design Model::").join("").split("::Design Model").join("");
	str = "static_javascript."+str;//Very ugly hack
    return str;
};



function fixClassStr(str){
    str = str.split(" ").join("").split("(")[0];
    return str;
};

function packageToFolders(str){
	var folders = str.split(".");
	if(!folders || !folders.length) return;
	
	var folderPath = getTarget();
	
	for(var i=0;i<folders.length;i++){
		folderPath += "\\" + folders[i];
		if(folderExists(folderPath) == false){
			try{
				createFolder(folderPath);
			}catch(e){
				
			}
		}
	}; 
};

function getPackagePath(str){
	var packagePath = getTarget();
	if(str && str != ""){
		packagePath += "\\"+str.split(".").join("\\");
	};
	return packagePath;
};
function getFilePath(package,name){
	var packagePath = getPackagePath(package);
	var path = packagePath+"\\"+name+".js";
	return path;
};



function identStr(str, ident, prefix) {
    result = "";
    var strs = str.split("\n");
    var len = strs.length;
    for (var i=0; i<len; i++) {
        for (var j=0; j<ident; j++)
            result += " ";
        result += prefix;
        result += strs[i];
        if (i != len-1)
             result += "\n";
    }
    return result;
}
// Get documentation string
function createJavaDoc(orgDocStr,indent,visibility) {
	var docStr = "";
	if(orgDocStr == "") return docStr;
	
	docStr += "\n";
	docStr += indent+"/**";
	docStr += "\n";
	docStr += identStr(orgDocStr, 0, indent+'* ');
	docStr += "\n";
	if(visibility == "private") docStr += indent+"* @private\n";
	docStr += indent+"*/";
	
	return docStr;
};

currentItem = currentItemStack.pop();
// END OF SCRIPT

// TEXT
print("");

// REPEAT
currentItemStack.push(currentItem);

try {
    eval('var rootElem = currentItem');
}catch (ex) {
    log('template.cot(389):<@REPEAT@> Error exists in  path expression.');
    throw ex
}
try {
    eval('var elemArr1 = getAllElements(true, rootElem, \'UMLClass\', \'\', \'\')');
}catch (ex) {
    log('template.cot(389):<@REPEAT@> Error exists in path, type, collection name.');
    throw ex
}
try {
    for (var i1 = 0, c1 = elemArr1.length; i1 < c1; i1++ ) {
        currentItem = elemArr1[i1];
        
        // TEXT
        print("");
        
        // SCRIPT
        currentItemStack.push(currentItem);
        
	//Build folder structure
	var package = fixFolderStr(current().Namespace.Pathname);
	packageToFolders(package);
	
	//Build Class files
	var name = fixClassStr(current().Name);
	path = getFilePath(package,name);
    fileBegin(path);

    var vClassName=current().Name;
    var oPHPClass= new PHPClassDefinition(current());

        currentItem = currentItemStack.pop();
        // END OF SCRIPT
        
        // TEXT
        print("");
        
        // REPEAT
        currentItemStack.push(currentItem);
        
        try {
            eval('var rootElem = prj');
        }catch (ex) {
            log('template.cot(403):<@REPEAT@> Error exists in :: path expression.');
            throw ex
        }
        try {
            eval('var elemArr2 = getAllElements(true, rootElem, \'UMLGeneralization\', \'\', \'\')');
        }catch (ex) {
            log('template.cot(403):<@REPEAT@> Error exists in path, type, collection name.');
            throw ex
        }
        try {
            for (var i2 = 0, c2 = elemArr2.length; i2 < c2; i2++ ) {
                currentItem = elemArr2[i2];
                
                // TEXT
                print("");
                
                // SCRIPT
                currentItemStack.push(currentItem);
                
	if(vClassName==current().Child.Name) oPHPClass.setParentClass(current().Parent);

                currentItem = currentItemStack.pop();
                // END OF SCRIPT
                
                // TEXT
                print("");
        
            }
        } catch (ex) {
            log('template.cot(403):<@REPEAT@> Error exists in command.');
            throw ex;
        }
        currentItem = currentItemStack.pop();
        // END OF REPEAT
        
        // TEXT
        print("");
print(oPHPClass.getDefinition());        
        // TEXT
        print("\n");
        
        // SCRIPT
        currentItemStack.push(currentItem);
        
    fileEnd();

        currentItem = currentItemStack.pop();
        // END OF SCRIPT
        
        // TEXT
        print("");

    }
} catch (ex) {
    log('template.cot(403):<@REPEAT@> Error exists in command.');
    throw ex;
}
currentItem = currentItemStack.pop();
// END OF REPEAT

// TEXT
print("");

// TEXT
print("");

// TEXT
print("");

// TEXT
print("");

// TEXT
print("");
