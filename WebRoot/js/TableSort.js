//************************************************************************************************
// ˵�������ڰ�TableתΪ�������Table
//
// ʹ�ã�1�������ñ�����������Զ�������role="head"
//       2������������Ҫ�����������Զ�������sort="true"
//       3��������չ�������磺$("#tableId").sorttable();
//
// ������JSON��ʽ
//       ==��ͨ����==
//       sorttingMsg:      ����ʱ��ʾ�����֣�Ĭ��Ϊ"�����С���"��,
//       sorttingMsgColor: ����ʱ��ʾ�����ֵ���ɫ��Ĭ��Ϊ"#FFF"��,
//       allowMask:        �Ƿ��������ֲ㣨Ĭ��Ϊtrue��,
//       maskOpacity:      ���ֲ��͸���ȣ�Ĭ��Ϊ"0.5"��,
//       maskColor:        ���ֲ����ɫ��Ĭ��Ϊ"#000"��,
//       ascImgUrl:        ����ͼƬ��Ĭ��Ϊ����ʾ��,
//       ascImgSize:       ����ͼƬ��С��Ĭ��Ϊ"8px"��,
//       descImgUrl:       ����ͼƬ��Ĭ��Ϊ����ʾ��,
//       descImgSize:      ����ͼƬ��С��Ĭ��Ϊ"8px"��
//
//       ==�ص�����==
//       onSorted(cell):   ������ɻص�������������cell����ǰ�����е�ͷ(һ����th����td��jquery����)��
//*************************************************************************************************
$.fn.extend({
    sorttable: function (setting) {
        // ���ò���
        var configer = $.fn.extend({
            // ����
            sorttingMsg: "�����С���",
            sorttingMsgColor: "#FFF",
            allowMask: true,
            maskOpacity: "0.5",
            maskColor: "#000",
            ascImgUrl: "",
            ascImgSize: "8px",
            descImgUrl: "",
            descImgSize: "8px",

            // �¼�
            onSorted: null // ������ɻص�����
        }, setting);

        // ��ȡ��չ����
        var extObj = $(this);
        // ������ס��ǰ�����Ķ���
        var lock = false;
        // �������ԵĿ�ȡֵ
        var sortOrder = {
            byAsc: "asc",
            byDesc: "desc"
        };
        // �Զ���������
        var myAttrs = {
            order: "order",
            by: "by",
            sort: "sort"
        };
        // �������е�ͷ�У�jquery���󡪡����ϣ�
        var headCells = extObj.find("tr[role='head']>[" + myAttrs.sort + "='true']");
        headCells.each(function () {
            if (configer.ascImgUrl != "" && configer.descImgUrl != "") {
                $("&nbsp;<img class='asc' src='" + configer.ascImgUrl + "' style='width:" + configer.ascImgSize + "; height:" + configer.ascImgSize + ";display:none;' title='����' alt='����'/>").appendTo($(this));
                $("&nbsp;<img class='desc' src='" + configer.descImgUrl + "' style='width:" + configer.descImgSize + "; height:" + configer.descImgSize + ";display:none;' title='����' alt='����'/>").appendTo($(this));
            }
            else {
                $("&nbsp;<span class='asc' style='width:12px; height:12px;display:none;' title='����'>&#118;</span>").appendTo($(this));
                $("&nbsp;<span class='desc' style='width:12px; height:12px;display:none;' title='����'>&#94;</span>").appendTo($(this));
            }
            $(this).css("cursor", "default");
        });

        // ����ͷ�е���¼�
        headCells.click(function () {
            var thisCell = $(this);

            if (lock == false) {
                lock = true; // ���¼�

                if (configer.allowMask) {
                    var tw = extObj.outerWidth();
                    var th = extObj.outerHeight();
                    var tOffSet = extObj.offset();
                    var tTop = tOffSet.top;
                    var tLeft = tOffSet.left;
                    // ������ֲ�
                    var mark = $("<div></div>").attr("id", "TableSort_Mark").css("background-color", configer.maskColor).css("position", "absolute").css("top", tTop + "px").css("left", tLeft + "px").css("opacity", configer.maskOpacity).css("z-index", "9999").css("width", tw + "px").css("height", th + "px");
                    mark.html("<h3 id='TableSort_Sortting' style='opacity:1;color:" + configer.sorttingMsgColor + ";padding:36px 0 0 0;text-align:center;'>" + configer.sorttingMsg + "</h3>");
                    mark.appendTo($("body"));

                    // ��ʱִ�����򷽷�����ʾ���ֲ���Ҫʱ��~
                    window.setTimeout(function () {
                        // ����������
                        SetColumnOrder(thisCell);
                        // ����������ɻص�����
                        FireHandleAfterSortting(thisCell);

                        // �������������ֲ�
                        lock = false;
                        mark.remove();

                    }, 100);
                }
                else {
                    // ����������
                    SetColumnOrder(thisCell);
                    // ����������ɻص�����
                    FireHandleAfterSortting(thisCell);

                    // �������������ֲ�
                    lock = false;
                }

                // ����ͷ�����е�����������Ϊfalse
                headCells.attr(myAttrs.order, false);
                // ������е������־����Ϊtrue
                thisCell.attr(myAttrs.order, true);
                // ���������е��������
                var by = thisCell.attr(myAttrs.by);
                thisCell.attr(myAttrs.by, (by == sortOrder.byAsc ? sortOrder.byDesc : sortOrder.byAsc));

            }
        });

        //====================================
        // ˵��������������ɻص�����
        // ������sortCell = ��ǰ�������ͷ
        //------------------------------------
        function FireHandleAfterSortting(sortCell) {
            if (configer.onSorted != null) {
                configer.onSorted(sortCell);
            }
        }

        //====================================
        // ˵��������������
        // ������headCell = ��ͷ��jquery����
        //------------------------------------
        function SetColumnOrder(headCell) {
            var by = headCell.attr(myAttrs.by);
            var index = headCell.index();
            var rs = extObj.find("tr[role!='head']");
            rs.sort(function (r1, r2) {
                var a = $.trim($(r1).children("td").eq(index).text());
                var b = $.trim($(r2).children("td").eq(index).text());
                if (a == b) {
                    return 0;
                }

                var isDt = IsTime(a) && IsTime(b);

                if (isDt) {
                    var dt1 = new Date(a.replace(/-/g, "/"));
                    var dt2 = new Date(b.replace(/-/g, "/"));
                    if (dt1.getTime() > dt2.getTime()) {
                        return (by == sortOrder.byAsc) ? 1 : -1;
                    }
                    else {
                        return (by == sortOrder.byAsc) ? -1 : 1;
                    }
                }
                else if (isNaN(a) || isNaN(b)) {
                    return (by == sortOrder.byAsc) ? a.localeCompare(b) : b.localeCompare(a);
                }
                else {

                    if (a - b > 0) {
                        return (by == sortOrder.byAsc) ? 1 : -1;
                    }
                    else {
                        return (by == sortOrder.byAsc) ? -1 : 1;
                    }
                }
            });
            extObj.find("tr[role!='head']").remove();
            extObj.append(rs);
            // ��ʾ��ͷ������ͼ��
            headCells.children(".asc,.desc").hide();
            if (by == sortOrder.byAsc) {
                headCell.children(".asc").show();
            }
            else {
                headCell.children(".desc").show();
            }
        }

        //================================================
        // ˵�����ж��ַ����Ƿ���ʱ��
        //------------------------------------------------
        function IsTime(dateString) {
            dateString = $.trim(dateString);
            if (dateString == null && dateString.length == 0) {
                return false;
            }

            dateString = dateString.replace(/\//g, "-");
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = dateString.match(reg);
            if (r == null) {
                var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
                var r = dateString.match(reg);
            }

            return r != null;
        }
    }
});