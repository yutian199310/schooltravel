"use strict";

var STravelItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.title = obj.title;
        this.value = obj.value;
        this.date = obj.date;
        this.phone = obj.phone;
    } else {
        this.key = "";
        this.title = "";
        this.phone = "";
        this.value = "";
        this.date = "";
    }
};

STravelItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var STravel = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new STravelItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "size");
};

STravel.prototype = {
    init: function () {
        this.size = 0;
    },

    save: function (key, title, value, date, phone) {
        var from = Blockchain.transaction.from;
        var sTravelItem = this.repo.get(key);
        if (sTravelItem) {
            //throw new Error("value has been occupied");
            sTravelItem.title = JSON.parse(sTravelItem).title + '|-' + title;
            sTravelItem.value = JSON.parse(sTravelItem).value + '|-' + value;
            sTravelItem.phone = JSON.parse(sTravelItem).phone + '|-' + phone;
            sTravelItem.date = JSON.parse(sTravelItem).date + '|-' + date;
            this.repo.put(key, sTravelItem);
        } else {
            sTravelItem = new STravelItem();
            sTravelItem.phone = phone;
            sTravelItem.title = title;
            sTravelItem.key = key;
            sTravelItem.value = value;
            sTravelItem.date = date;
            this.repo.put(key, sTravelItem);
            this.size += 1;
        }
    },
    len: function () {
        return this.size;
    },
    get: function (key) {
        return this.repo.get(key);
    },
    forEach: function (limit) {
        var result = [];
        for (var i = 1; i < limit; i++) {
            var temp = this.repo.get(i.toString());
            if (temp) {
                result.push(temp);
            }
        }
        return result;
    }
};
module.exports = STravel;