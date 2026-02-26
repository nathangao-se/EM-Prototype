// ========================================
// SHARED WIZARD STEPS — Activities Rendering
// Extends window.WizardSteps with activities table builders and bindings.
// Depends on: wizard-steps.js (base)
// ========================================

(function () {

  var WS = window.WizardSteps;
  var esc = WS.esc;
  var numberFmt = WS.numberFmt;
  var scopeClass = WS.scopeClass;

  // ===========================================
  // SELECT ACTIVITIES STEP — Content + Bindings
  // ===========================================

  function buildGroupedActivitiesTable(ctx) {
    var p = ctx.prefix;
    var groups = ctx.activityGroups;

    var actMap = {};
    ctx.activities.forEach(function (a) { actMap[a.id] = a; });

    var allSel = ctx.activities.every(function (a) { return ctx.activitySelections[a.id]; });

    var table =
      '<div class="inv-table-wrap"><table class="inv-table">' +
        '<thead><tr>' +
          '<th style="width:32px"><input type="checkbox" class="inv-table-checkbox" id="' + p + '-act-select-all"' + (allSel ? ' checked' : '') + '></th>' +
          '<th>Activities</th>' +
          '<th>Scope</th>' +
          '<th style="text-align:right">Entities</th>' +
          '<th style="text-align:right">Records</th>' +
          '<th>Calc method</th>' +
          '<th>Status</th>' +
        '</tr></thead><tbody>';

    groups.forEach(function (group) {
      var children = group.activityIds.map(function (id) { return actMap[id]; }).filter(Boolean);
      var isExpanded = ctx.activityGroupExpanded[group.id] !== false;
      var selCount = children.filter(function (a) { return ctx.activitySelections[a.id]; }).length;
      var allGroupSel = selCount === children.length;

      var totalEntities = 0;
      var totalRecords = 0;
      children.forEach(function (a) { totalEntities += a.entities; totalRecords += a.records; });

      var sc = scopeClass({ scope: group.scope });
      var groupCollapsedCls = isExpanded ? '' : ' inv-act-group-toggle--collapsed';

      table +=
        '<tr class="inv-table-group-row">' +
          '<td><input type="checkbox" class="inv-table-checkbox" data-ws-group-cb="' + group.id + '"' + (allGroupSel ? ' checked' : '') + '></td>' +
          '<td>' +
            '<button class="inv-act-group-toggle' + groupCollapsedCls + '" data-ws-group-toggle="' + group.id + '">' +
              '<i class="fa-solid fa-chevron-down"></i>' +
            '</button>' +
            esc(group.name) +
            ' <span class="inv-act-group-count" data-ws-group-count="' + group.id + '">(' + selCount + '/' + children.length + ')</span>' +
          '</td>' +
          '<td></td>' +
          '<td style="text-align:right">' + numberFmt(totalEntities) + '</td>' +
          '<td style="text-align:right">' + numberFmt(totalRecords) + '</td>' +
          '<td></td>' +
          '<td></td>' +
        '</tr>';

      var rowCollapsedCls = isExpanded ? '' : ' inv-row-collapsed';

      children.forEach(function (a) {
        var asc = scopeClass(a);
        var statusClass = a.status === 'ready' ? 'inv-status-badge--ready' : 'inv-status-badge--need';
        var statusIcon = a.status === 'ready' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-info"></i>';
        var statusText = a.status === 'ready' ? 'Ready' : 'Needs data';
        var checked = ctx.activitySelections[a.id] ? ' checked' : '';

        table +=
          '<tr data-ws-group-child="' + group.id + '" class="' + rowCollapsedCls + '">' +
            '<td style="padding-left:36px"><div class="inv-cell-inner"><input type="checkbox" class="inv-table-checkbox" data-ws-act="' + a.id + '"' + checked + '></div></td>' +
            '<td style="padding-left:32px"><div class="inv-cell-inner">' + esc(a.name) + '</div></td>' +
            '<td><div class="inv-cell-inner"><span class="inv-scope-badge ' + asc + '">Scope ' + a.scope + '</span></div></td>' +
            '<td style="text-align:right"><div class="inv-cell-inner">' + numberFmt(a.entities) + '</div></td>' +
            '<td style="text-align:right"><div class="inv-cell-inner">' + numberFmt(a.records) + '</div></td>' +
            '<td><div class="inv-cell-inner"><span class="inv-calc-select">' + esc(a.calc) + ' <i class="fa-solid fa-chevron-down"></i></span></div></td>' +
            '<td><div class="inv-cell-inner"><span class="inv-status-badge ' + statusClass + '">' + statusIcon + ' ' + statusText + '</span></div></td>' +
          '</tr>';
      });
    });

    table += '</tbody></table></div>';
    return table;
  }

  function buildActivitiesContent(ctx) {
    var p = ctx.prefix;
    var groups = ctx.activityGroups;

    var toolbar =
      '<div class="inv-toolbar">' +
        '<input type="text" class="inv-search" placeholder="Search activities...">' +
      '</div>';

    if (groups && groups.length > 0) {
      return toolbar + buildGroupedActivitiesTable(ctx);
    }

    var allSel = ctx.activities.every(function (a) { return ctx.activitySelections[a.id]; });

    var table =
      '<div class="inv-table-wrap"><table class="inv-table">' +
        '<thead><tr>' +
          '<th style="width:32px"><input type="checkbox" class="inv-table-checkbox" id="' + p + '-act-select-all"' + (allSel ? ' checked' : '') + '></th>' +
          '<th>Activities</th>' +
          '<th>Scope</th>' +
          '<th style="text-align:right">Entities</th>' +
          '<th style="text-align:right">Records</th>' +
          '<th>Calc method</th>' +
          '<th>Status</th>' +
        '</tr></thead><tbody>';

    ctx.activities.forEach(function (a) {
      var sc = scopeClass(a);
      var statusClass = a.status === 'ready' ? 'inv-status-badge--ready' : 'inv-status-badge--need';
      var statusIcon = a.status === 'ready' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-info"></i>';
      var statusText = a.status === 'ready' ? 'Ready' : 'Needs data';
      var checked = ctx.activitySelections[a.id] ? ' checked' : '';

      table +=
        '<tr>' +
          '<td><input type="checkbox" class="inv-table-checkbox" data-ws-act="' + a.id + '"' + checked + '></td>' +
          '<td>' + esc(a.name) + '</td>' +
          '<td><span class="inv-scope-badge ' + sc + '">Scope ' + a.scope + '</span></td>' +
          '<td style="text-align:right">' + numberFmt(a.entities) + '</td>' +
          '<td style="text-align:right">' + numberFmt(a.records) + '</td>' +
          '<td><span class="inv-calc-select">' + esc(a.calc) + ' <i class="fa-solid fa-chevron-down"></i></span></td>' +
          '<td><span class="inv-status-badge ' + statusClass + '">' + statusIcon + ' ' + statusText + '</span></td>' +
        '</tr>';
    });

    table += '</tbody></table></div>';
    return toolbar + table;
  }

  function refreshActivitiesGroupStates(ctx) {
    var b = ctx.body;
    var p = ctx.prefix;
    var groups = ctx.activityGroups;
    if (!groups) return;

    var actMap = {};
    ctx.activities.forEach(function (a) { actMap[a.id] = a; });

    var allActivitiesSel = true;
    var anyActivitiesSel = false;

    groups.forEach(function (group) {
      var children = group.activityIds.map(function (id) { return actMap[id]; }).filter(Boolean);
      var selCount = children.filter(function (a) { return ctx.activitySelections[a.id]; }).length;
      var allGroupSel = selCount === children.length;
      var noneGroupSel = selCount === 0;

      if (!allGroupSel) allActivitiesSel = false;
      if (selCount > 0) anyActivitiesSel = true;

      var groupCb = b.querySelector('[data-ws-group-cb="' + group.id + '"]');
      if (groupCb) {
        groupCb.checked = allGroupSel;
        groupCb.indeterminate = !allGroupSel && !noneGroupSel;
      }

      var countEl = b.querySelector('[data-ws-group-count="' + group.id + '"]');
      if (countEl) countEl.textContent = '(' + selCount + '/' + children.length + ')';
    });

    var selectAll = document.getElementById(p + '-act-select-all');
    if (selectAll) {
      selectAll.checked = allActivitiesSel;
      selectAll.indeterminate = !allActivitiesSel && anyActivitiesSel;
    }
  }

  function bindActivitiesStep(ctx, onChange) {
    var b = ctx.body;
    var p = ctx.prefix;
    var groups = ctx.activityGroups;

    if (groups && groups.length > 0) {
      b.querySelectorAll('[data-ws-group-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var gid = this.dataset.wsGroupToggle;
          var expanded = ctx.activityGroupExpanded[gid] = !ctx.activityGroupExpanded[gid];
          this.classList.toggle('inv-act-group-toggle--collapsed', !expanded);
          b.querySelectorAll('[data-ws-group-child="' + gid + '"]').forEach(function (row) {
            row.classList.toggle('inv-row-collapsed', !expanded);
          });
        });
      });

      b.querySelectorAll('[data-ws-group-cb]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          var gid = this.dataset.wsGroupCb;
          var checked = this.checked;
          var group = null;
          for (var i = 0; i < groups.length; i++) {
            if (groups[i].id === gid) { group = groups[i]; break; }
          }
          if (!group) return;
          group.activityIds.forEach(function (aid) {
            ctx.activitySelections[aid] = checked;
            var childCb = b.querySelector('[data-ws-act="' + aid + '"]');
            if (childCb) childCb.checked = checked;
          });
          refreshActivitiesGroupStates(ctx);
          if (onChange) onChange();
        });
      });

      b.querySelectorAll('.inv-table-checkbox[data-ws-act]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          ctx.activitySelections[this.dataset.wsAct] = this.checked;
          refreshActivitiesGroupStates(ctx);
          if (onChange) onChange();
        });
      });

      var selectAllAct = document.getElementById(p + '-act-select-all');
      if (selectAllAct) {
        selectAllAct.addEventListener('change', function () {
          var checked = this.checked;
          ctx.activities.forEach(function (a) { ctx.activitySelections[a.id] = checked; });
          b.querySelectorAll('.inv-table-checkbox[data-ws-act]').forEach(function (cb) { cb.checked = checked; });
          refreshActivitiesGroupStates(ctx);
          if (onChange) onChange();
        });
      }

      refreshActivitiesGroupStates(ctx);

    } else {
      b.querySelectorAll('.inv-table-checkbox[data-ws-act]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          ctx.activitySelections[this.dataset.wsAct] = this.checked;
          var selectAll = document.getElementById(p + '-act-select-all');
          if (selectAll) {
            selectAll.checked = ctx.activities.every(function (a) { return ctx.activitySelections[a.id]; });
          }
          if (onChange) onChange();
        });
      });

      var selectAllAct = document.getElementById(p + '-act-select-all');
      if (selectAllAct) {
        selectAllAct.addEventListener('change', function () {
          var checked = this.checked;
          ctx.activities.forEach(function (a) { ctx.activitySelections[a.id] = checked; });
          b.querySelectorAll('.inv-table-checkbox[data-ws-act]').forEach(function (cb) { cb.checked = checked; });
          if (onChange) onChange();
        });
      }
    }
  }

  // ===========================================
  // EXTEND PUBLIC API
  // ===========================================

  WS.buildActivitiesContent = buildActivitiesContent;
  WS.bindActivitiesStep = bindActivitiesStep;

})();
