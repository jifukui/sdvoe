var EDID={
    showlog:false,
    filename:"",
    length:0,
    onEdidLoaded:false,
    onEdidError:false,
    data:[],
    edid:[],
    dataBlocks:[],
    Check:[],
    edidTable:"",
    edidErrorInfo:"",
};
EDID.setEdidData=function(data)
{
    data = data.toUpperCase();
    var dataArray = EDID.makeDataToArray(data);
    EDID.edid=EDID.makeDataChar(dataArray);
    EDID.data = dataArray;
    EDID.length = EDID.getEdidLength(dataArray);
    EDID.Check = EDID.GetCheck(dataArray);
    var table = EDID.getTable(dataArray);
    EDID.edidTable = table;
    if (EDID.isValidEdid())
    {
        
        EDID.getDataBlocks();
        
        if (EDID.onEdidLoaded != null)
        {
            //EDID.onEdidLoaded(EDID);
        }
    }
    else
    {
        if (EDID.onEdidError != null)
        {
            return EDID.onEdidError();
        }
    }

}
EDID.isValidEdid = function ()
{
    var valid = true;
    if (EDID.data[0] != "00" ||
        EDID.data[1] != "FF" ||
        EDID.data[2] != "FF" ||
        EDID.data[3] != "FF" ||
        EDID.data[4] != "FF" ||
        EDID.data[5] != "FF" ||
        EDID.data[6] != "FF" ||
        EDID.data[7] != "00")
    {
        valid = false;
        EDID.edidErrorInfo="EDID Header Error";
        return valid;
    }
    if(EDID.data[0x36]=="00"&&EDID.data[0x37]=="00")
    {
        valid = false;
        EDID.edidErrorInfo="EDID Video Information Error";
        return valid;
    }
    if(parseInt(EDID.data[127],16)!=EDID.Check[0])
    {
        valid = false;
        EDID.edidErrorInfo="EDID Block 1 redundancy Error"
        return valid;
    }
    if(EDID.length!=128)
    {
        if(parseInt(EDID.data[0x82],16)>=1&&parseInt(EDID.data[0x82],16)<=3||parseInt(EDID.data[0x82],16)>0x6d)
        {
            valid = false;
            EDID.edidErrorInfo="EDID Length Error";
            return valid;
        }
        if((parseInt(EDID.data[0x83],16)&0xf)>7)
        {
            valid = false;
            EDID.edidErrorInfo="EDID Length Error";
            return valid;
        }
        var i;
        for(i=2;i<=EDID.length/128;i++)
        {
            if(parseInt(EDID.data[i*128-1],16)!=EDID.Check[i-1])
            {
                valid = false;
                EDID.edidErrorInfo="EDID Block "+i+ " redundancy Error";
                return valid;
            }
        }
    }
        return valid;
}
EDID.getName = function ()
{
        // Search for the name
    var indexs = [54, 72, 90, 108];
    var name = "";
    var found = false;
    for (var i = 0; i < indexs.length; i++)
    {
        var ps = indexs[i];
        if (EDID.data[ps + 0] == "00" &&
            EDID.data[ps + 1] == "00" &&
            EDID.data[ps + 2] == "00" &&
            EDID.data[ps + 3] == "FC")
        {
            for (var n = 0; n < 13; n++)
            {
                name += String.fromCharCode(EDID.edid[ps + n + 5]);
            }
            found = true;
            break;
        }
    }

    if (found == false)
    {
        name = String.fromCharCode(EDID.edid[8]);
        name += String.fromCharCode(EDID.edid[9]);
    }
    return name;
};

EDID.getNativeResolution = function ()
{
    var edid = EDID.edid;
    var dtd = 54; // # start byte of detailed timing desc.
    var horizontalRes = ((edid[dtd + 4] >> 4) << 8) | edid[dtd + 2];
    var verticalRes = ((edid[dtd + 7] >> 4) << 8) | edid[dtd + 5];
    return horizontalRes.toString()+"*"+verticalRes.toString();
};

EDID.getLength = function ()
{
    return EDID.length;
};
EDID.onEdidError = function ()
{
    return 'errorEDID'
};

EDID.getAudioChannels = function ()
{
    var block = EDID.getDataBlocksByTag(1);
    var i;
    var len = 0;
    if (block)
    {
        var data = block["block"];
        for(i=1;i<=data.length;i+=3)
        {
            len=(data[i]&parseInt("00000111", 2)) + 1;
            if(len>2)
            {
                break;
            }
        }
    }
    var str="";
    if(len>0)
    {
        if(len>2)
        {
            str="Multichannel audio";
        }
        else
        {
            str="2 channels Audio";
        }
    }
    return str;
};

EDID.getDeepColor = function ()
{
    var block = EDID.getDataBlocksByTag(3);
    var support = "";

    if (block)
    {
        var data = block["block"];

        if (data[1] == 3 && data[2] == 12 && data[3] == 0)
        {
            var mask = parseInt("00010000", 2);
            var masked = mask & data[6];
            if (masked == mask)
            {
                support += "30bit ";
            }

            mask = parseInt("00100000", 2);
            masked = mask & data[6];
            if (masked == mask)
            {
                support += "36bit ";
            }

            mask = parseInt("01000000", 2);
            masked = mask & data[6];
            if (masked == mask)
            {
                support += "48bit";
            }
        }
    }
    if (support == "")
    {
        support = "No supported";
    }

    return support;
};

EDID.getDataBlocksByTag = function (tagId)
{
    for (var i = 0; i < EDID.dataBlocks.length; i++)
    {
        if (EDID.dataBlocks[i]["tag"] == tagId)
        {
            return EDID.dataBlocks[i];
        }
    }
};

EDID.getDataBlocks = function ()
{
    EDID.dataBlocks = new Array();
    if(EDID.length<=128)
    {
        return ;
    }
    var edid = EDID.edid;
    var start = 132;
    var end = edid[130] + start;
    var blocks = new Array();
    var lengs = new Array();
    var tags = new Array();
    var nextLen = start;
    var blockIndex = 0;
    if (EDID.showLog)
    {
        //console.log("datablock d:" + edid[130]);
    }

    for (var i = start; i < end; i++)
    {
        if (i == nextLen)
        {
            if (EDID.showLog)
            {
                if (blockIndex != 0)
                {
                    console.log("   + Block : " + EDID.dataBlocks[blockIndex - 1]["block"]);
                }
            }

            tags[blockIndex] = (edid[i] & parseInt("11100000", 2)) >> 5;
            lengs[blockIndex] = edid[i] & parseInt("00011111", 2);
            nextLen += lengs[blockIndex] + 1;
            if(tags[blockIndex]==1)
            {
                //ligObject.DVIEdid=false;
            }
            if (EDID.showLog)
            {
                console.log("datablock #" + (blockIndex + 1) + " Block : 0x" + edid[i].toString(16) + " Tag:" + tags[blockIndex] + " Len:" + lengs[blockIndex]);
            }

            EDID.dataBlocks[blockIndex] = new Array();
            EDID.dataBlocks[blockIndex]["tag"] = tags[blockIndex];
            EDID.dataBlocks[blockIndex]["len"] = lengs[blockIndex];
            EDID.dataBlocks[blockIndex]["block"] = new Array();
            blockIndex++;
        }
        EDID.dataBlocks[blockIndex - 1]["block"].push(edid[i]);
    }
}


EDID.makeDataToArray = function (data)
{
    var par = 0;
    var newData = "";
    for (var i = 0; i < data.length; i++)
    {
        if (par == 2)
        {
            newData += " ";
            par = 0;
        }
        newData += data[i];
        par++;
    }
    return newData.split(' ');
};
EDID.makeDataChar = function (dataArray)
{
    var iarray = new Array();
    for (var i = 0; i < dataArray.length; i++)
    {
        iarray[i] = parseInt(dataArray[i], 16);
    }
    return iarray;
};
EDID.getTable = function (dataArray)
{
    var table = "<table>";
    table += "<tr>";
    for (var i = 0; i < dataArray.length; i++)
    {
        if (i % 16 == 0)
        {
            table += "</tr>";
            table += "<tr>";
        }

        table += "<td>" + dataArray[i] + "</td>";
    }
    table += "</td>";
    table += "</table>";
    return table;
};

EDID.getEdidLength = function (dataArray)
{
    switch (parseInt(dataArray[126]))
    {
        case 0: return 128 * 1;
        case 1: return 128 * 2;
        case 2: return 128 * 3;
        case 3: return 128 * 4;
        case 4: return 128 * 5;
        case 5: return 128 * 6;
        case 6: return 128 * 7;
        case 7: return 128 * 8;
        default: return 128;
    }
};
EDID.GetCheck=function (dataArray) {
    var CheckNum=new Array();
    var i,n,sum;
    for(i=0;i<EDID.length/128;i++)
    {
        sum=0;
        for(n=0;n<127;n++)
        {
            sum+=parseInt(dataArray[128*i+n],16);
        }
        sum%=256;
        sum=0x100-sum;
        CheckNum[i]=sum%256;
    }
    return CheckNum;
};
EDID.EDIDERR=function()
{
    //console.log("jifukui "+EDID.edidErrorInfo)
    return EDID.edidErrorInfo;
}
export {
    EDID
};
//@ sourceURL=edidReader.js