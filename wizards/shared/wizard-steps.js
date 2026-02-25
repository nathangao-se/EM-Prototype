// ========================================
// SHARED WIZARD STEPS
// Used by both Inventory and Campaign wizards.
// Each wizard passes a `ctx` (context) object:
//   {
//     prefix:              'inv' | 'dcc',
//     body:                DOM element (wizard body),
//     entityTree:          array of entity nodes,
//     activities:          array of activity objects,
//     entitySelections:    { id: bool },
//     entityExpanded:      { id: bool },
//     activitySelections:  { id: bool },
//     assignEntityChecked: { id: bool },
//     entityActivities:    { entityId: { activityId: true } }
//   }
// ========================================

window.WizardSteps = (function () {

  // ===========================================
  // UTILITIES
  // ===========================================

  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function numberFmt(n) {
    if (typeof n !== 'number') return n;
    return n.toLocaleString();
  }

  function scopeClass(a) {
    return a.scope === 1 ? 'inv-scope-badge--s1' : a.scope === 2 ? 'inv-scope-badge--s2' : 'inv-scope-badge--s3';
  }

  // ===========================================
  // TREE HELPERS
  // ===========================================

  function countSelected(node, selections) {
    var count = 0;
    if (selections[node.id]) count++;
    if (node.children) {
      node.children.forEach(function (c) { count += countSelected(c, selections); });
    }
    return count;
  }

  function countTotal(node) {
    if (node.total > 0) return node.total;
    var count = 0;
    if (node.children) {
      node.children.forEach(function (c) { count += countTotal(c); });
    }
    return count || 1;
  }

  function findNode(id, nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) return nodes[i];
      if (nodes[i].children) {
        var found = findNode(id, nodes[i].children);
        if (found) return found;
      }
    }
    return null;
  }

  function setDescendants(node, checked, selectionMap) {
    if (node.children) {
      node.children.forEach(function (c) {
        selectionMap[c.id] = checked;
        setDescendants(c, checked, selectionMap);
      });
    }
  }

  function isAllSelected(tree, selections) {
    var all = true;
    function walk(nodes) {
      nodes.forEach(function (n) {
        if (!selections[n.id]) all = false;
        if (n.children) walk(n.children);
      });
    }
    walk(tree);
    return all;
  }

  function getEntityPath(entityId, tree) {
    function walk(nodes, ancestors) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id === entityId) {
          if (ancestors.length === 0) return nodes[i].name;
          if (ancestors.length === 1) return ancestors[0] + '/' + nodes[i].name;
          return ancestors[0] + '/.../' + nodes[i].name;
        }
        if (nodes[i].children && nodes[i].children.length) {
          var found = walk(nodes[i].children, ancestors.concat([nodes[i].name]));
          if (found) return found;
        }
      }
      return null;
    }
    return walk(tree, []) || entityId;
  }

  // ===========================================
  // STATS BAR
  // ===========================================

  function getTotals(ctx) {
    var totalActivities = 0;
    ctx.activities.forEach(function (a) {
      if (ctx.activitySelections[a.id]) totalActivities++;
    });

    var totalEntities = 0;
    var totalRecords = 0;
    function walkSelected(nodes) {
      nodes.forEach(function (n) {
        if (ctx.entitySelections[n.id]) {
          totalEntities += (n.total > 0 ? n.total : 1);
          totalRecords += n.records;
        }
        if (n.children && n.children.length) walkSelected(n.children);
      });
    }
    walkSelected(ctx.entityTree);

    return { activities: totalActivities, entities: totalEntities, records: totalRecords };
  }

  function buildStatsBar(ctx) {
    var t = getTotals(ctx);
    var p = ctx.prefix;
    return '<div class="inv-stats-bar">' +
      '<div class="inv-stat"><span class="inv-stat-value" id="' + p + '-kpi-activities">' + numberFmt(t.activities) + '</span><span class="inv-stat-label">Activities</span></div>' +
      '<div class="inv-stat"><span class="inv-stat-value" id="' + p + '-kpi-entities">' + numberFmt(t.entities) + '</span><span class="inv-stat-label">Entities selected</span></div>' +
      '<div class="inv-stat"><span class="inv-stat-value" id="' + p + '-kpi-records">' + numberFmt(t.records) + '</span><span class="inv-stat-label">Records</span></div>' +
      '</div>';
  }

  function refreshStatsBar(ctx) {
    var t = getTotals(ctx);
    var p = ctx.prefix;
    var elAct = document.getElementById(p + '-kpi-activities');
    var elEnt = document.getElementById(p + '-kpi-entities');
    var elRec = document.getElementById(p + '-kpi-records');
    if (elAct) elAct.textContent = numberFmt(t.activities);
    if (elEnt) elEnt.textContent = numberFmt(t.entities);
    if (elRec) elRec.textContent = numberFmt(t.records);
  }

  // ===========================================
  // ADD ENTITIES STEP — Content + Bindings
  // ===========================================

  function buildEntityTreeHTML(nodes, depth, ctx) {
    var html = '';
    nodes.forEach(function (node) {
      var hasChildren = node.children && node.children.length > 0;
      var isExpanded = ctx.entityExpanded[node.id];
      var isChecked = ctx.entitySelections[node.id];
      var selCount = countSelected(node, ctx.entitySelections);
      var totCount = node.total || countTotal(node);

      html += '<div class="inv-tree-node" style="padding-left:' + (depth * 24) + 'px">';

      if (hasChildren) {
        var toggleCls = isExpanded ? '' : ' inv-tree-toggle--collapsed';
        html += '<button class="inv-tree-toggle' + toggleCls + '" data-ws-toggle="' + node.id + '">' +
          '<i class="fa-solid fa-chevron-down"></i></button>';
      } else {
        html += '<span class="inv-tree-toggle inv-tree-toggle--leaf"></span>';
      }

      html += '<input type="checkbox" class="inv-tree-cb" data-ws-cb="' + node.id + '"' + (isChecked ? ' checked' : '') + '>';
      html += '<span class="inv-tree-name">' + esc(node.name);
      if (hasChildren || totCount > 0) {
        html += ' <span class="inv-tree-name-count">(' + selCount + '/' + totCount + ')</span>';
      }
      html += '</span>';
      html += '<span class="inv-tree-act">' + node.activities + '</span>';
      html += '<span class="inv-tree-rec">' + numberFmt(node.records) + '</span>';
      html += '</div>';

      if (hasChildren) {
        html += '<div class="inv-tree-children' + (isExpanded ? ' inv-tree-children--open' : '') + '" data-ws-children="' + node.id + '">';
        html += buildEntityTreeHTML(node.children, depth + 1, ctx);
        html += '</div>';
      }
    });
    return html;
  }

  function buildEntitiesContent(ctx) {
    var p = ctx.prefix;
    var selectAllChecked = isAllSelected(ctx.entityTree, ctx.entitySelections) ? ' checked' : '';

    var toolbar =
      '<div class="inv-toolbar">' +
        '<input type="text" class="inv-search" placeholder="Search entities...">' +
      '</div>';

    var header =
      '<div class="inv-tree-header">' +
        '<span class="inv-tree-header-entity" style="display:flex;align-items:center;gap:8px">' +
          '<input type="checkbox" class="inv-tree-cb" id="' + p + '-select-all"' + selectAllChecked + '>' +
          'Entities <span class="inv-tree-name-count">(selected/total)</span>' +
        '</span>' +
        '<span class="inv-tree-header-act">Activities</span>' +
        '<span class="inv-tree-header-rec">Records</span>' +
      '</div>';

    var tree = '<div class="inv-tree-wrap">' + buildEntityTreeHTML(ctx.entityTree, 0, ctx) + '</div>';

    return toolbar + header + tree;
  }

  function refreshEntityTreeUI(ctx) {
    var p = ctx.prefix;
    ctx.body.querySelectorAll('.inv-tree-cb[data-ws-cb]').forEach(function (cb) {
      cb.checked = !!ctx.entitySelections[cb.dataset.wsCb];
    });
    var selectAll = document.getElementById(p + '-select-all');
    if (selectAll) selectAll.checked = isAllSelected(ctx.entityTree, ctx.entitySelections);
  }

  function bindEntitiesStep(ctx, onChange) {
    var b = ctx.body;
    var p = ctx.prefix;

    b.querySelectorAll('.inv-tree-toggle[data-ws-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.dataset.wsToggle;
        ctx.entityExpanded[id] = !ctx.entityExpanded[id];
        var childrenEl = b.querySelector('[data-ws-children="' + id + '"]');
        if (childrenEl) childrenEl.classList.toggle('inv-tree-children--open');
        this.classList.toggle('inv-tree-toggle--collapsed', !ctx.entityExpanded[id]);
      });
    });

    b.querySelectorAll('.inv-tree-cb[data-ws-cb]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = this.dataset.wsCb;
        ctx.entitySelections[id] = this.checked;
        var node = findNode(id, ctx.entityTree);
        if (node) setDescendants(node, this.checked, ctx.entitySelections);
        refreshEntityTreeUI(ctx);
        if (onChange) onChange();
      });
    });

    var selectAll = document.getElementById(p + '-select-all');
    if (selectAll) {
      selectAll.addEventListener('change', function () {
        var checked = this.checked;
        function walkAll(nodes) {
          nodes.forEach(function (n) {
            ctx.entitySelections[n.id] = checked;
            if (n.children) walkAll(n.children);
          });
        }
        walkAll(ctx.entityTree);
        refreshEntityTreeUI(ctx);
        if (onChange) onChange();
      });
    }
  }

  // ===========================================
  // SELECT ACTIVITIES STEP — Content + Bindings
  // ===========================================

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
          '<td><span class="inv-scope-badge ' + sc + '">Scope ' + group.scope + '</span></td>' +
          '<td style="text-align:right">' + numberFmt(totalEntities) + '</td>' +
          '<td style="text-align:right">' + numberFmt(totalRecords) + '</td>' +
          '<td></td>' +
          '<td></td>' +
        '</tr>';

      var rowCollapsedCls = isExpanded ? '' : ' inv-row-collapsed';

      children.forEach(function (a) {
        var statusClass = a.status === 'ready' ? 'inv-status-badge--ready' : 'inv-status-badge--need';
        var statusIcon = a.status === 'ready' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-info"></i>';
        var statusText = a.status === 'ready' ? 'Ready' : 'Needs data';
        var checked = ctx.activitySelections[a.id] ? ' checked' : '';

        table +=
          '<tr data-ws-group-child="' + group.id + '" class="' + rowCollapsedCls + '">' +
            '<td style="padding-left:36px"><div class="inv-cell-inner"><input type="checkbox" class="inv-table-checkbox" data-ws-act="' + a.id + '"' + checked + '></div></td>' +
            '<td style="padding-left:32px"><div class="inv-cell-inner">' + esc(a.name) + '</div></td>' +
            '<td><div class="inv-cell-inner"></div></td>' +
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
      // Group expand/collapse
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

      // Group checkbox propagates to children
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

      // Individual activity checkbox updates parent group
      b.querySelectorAll('.inv-table-checkbox[data-ws-act]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          ctx.activitySelections[this.dataset.wsAct] = this.checked;
          refreshActivitiesGroupStates(ctx);
          if (onChange) onChange();
        });
      });

      // Select-all propagates to everything
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
      // Flat table bindings (no groups)
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
  // ADD ACTIVITIES TO ENTITIES STEP (additive)
  // ===========================================

  function initAssignStep(ctx) {
    ctx.assignEntityChecked = {};
    ctx.entityActivities = {};

    // Collect entities selected in step 2
    var eligible = [];
    function walk(nodes) {
      nodes.forEach(function (n) {
        if (ctx.entitySelections[n.id]) eligible.push(n.id);
        if (n.children) walk(n.children);
      });
    }
    walk(ctx.entityTree);

    if (eligible.length < 2) return;

    // Pre-check last two eligible entities for demo
    var e1 = eligible[eligible.length - 2];
    var e2 = eligible[eligible.length - 1];
    ctx.assignEntityChecked[e1] = true;
    ctx.assignEntityChecked[e2] = true;

    // Pre-assign some activities for demo variety
    var pool = ctx.activities.filter(function (a) { return ctx.activitySelections[a.id]; });
    if (pool.length < 6) return;

    ctx.entityActivities[e1] = {};
    ctx.entityActivities[e2] = {};

    // Shared (in both): Fugitive emissions (idx 2), Business travel (idx 12)
    ctx.entityActivities[e1][pool[2].id] = true;
    ctx.entityActivities[e2][pool[2].id] = true;
    if (pool.length > 12) {
      ctx.entityActivities[e1][pool[12].id] = true;
      ctx.entityActivities[e2][pool[12].id] = true;
    }

    // Only in e1: Stationary combustion (0), Mobile combustion (1)
    ctx.entityActivities[e1][pool[0].id] = true;
    ctx.entityActivities[e1][pool[1].id] = true;

    // Only in e2: Purchased electricity (4), Purchased steam (5)
    ctx.entityActivities[e2][pool[4].id] = true;
    ctx.entityActivities[e2][pool[5].id] = true;
  }

  function isEntityEligible(node, ctx) {
    if (ctx.entitySelections[node.id]) return true;
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        if (isEntityEligible(node.children[i], ctx)) return true;
      }
    }
    return false;
  }

  function getCheckedEntityIds(ctx) {
    var ids = [];
    for (var k in ctx.assignEntityChecked) {
      if (ctx.assignEntityChecked[k]) ids.push(k);
    }
    return ids;
  }

  function computeAssignGroups(ctx) {
    var checkedIds = getCheckedEntityIds(ctx);
    if (checkedIds.length === 0) {
      return { available: [], shared: [], perEntity: {} };
    }

    var pool = ctx.activities.filter(function (a) { return ctx.activitySelections[a.id]; });

    var available = [];
    var shared = [];
    var perEntity = {};
    checkedIds.forEach(function (eid) { perEntity[eid] = []; });

    pool.forEach(function (a) {
      var inEntities = checkedIds.filter(function (eid) {
        return ctx.entityActivities[eid] && ctx.entityActivities[eid][a.id];
      });

      if (inEntities.length === checkedIds.length) {
        shared.push(a);
      } else {
        available.push(a);
        inEntities.forEach(function (eid) {
          perEntity[eid].push(a);
        });
      }
    });

    return { available: available, shared: shared, perEntity: perEntity };
  }

  // ---- Assign: entity tree (left panel) ----

  function buildAssignEntityTreeHTML(nodes, depth, ctx) {
    var html = '';
    nodes.forEach(function (node) {
      var hasChildren = node.children && node.children.length > 0;
      var isExpanded = ctx.entityExpanded[node.id];
      var eligible = isEntityEligible(node, ctx);
      var isChecked = ctx.assignEntityChecked[node.id] || false;
      var selCount = countSelected(node, ctx.entitySelections);
      var totCount = node.total || countTotal(node);

      var disabledStyle = eligible ? '' : ' opacity:0.4;';
      html += '<div class="inv-tree-node" style="padding-left:' + (depth * 20) + 'px;font-size:13px;' + disabledStyle + '">';

      if (hasChildren) {
        var atToggleCls = isExpanded ? '' : ' inv-tree-toggle--collapsed';
        html += '<button class="inv-tree-toggle' + atToggleCls + '" data-ws-at-toggle="' + node.id + '" style="width:20px;font-size:10px">' +
          '<i class="fa-solid fa-chevron-down"></i></button>';
      } else {
        html += '<span class="inv-tree-toggle inv-tree-toggle--leaf" style="width:20px"></span>';
      }

      html += '<input type="checkbox" class="inv-tree-cb" data-ws-at-cb="' + node.id + '"' +
        (isChecked ? ' checked' : '') + (eligible ? '' : ' disabled') + '>';
      html += '<span class="inv-tree-name" style="font-size:13px">' + esc(node.name);
      if (totCount > 0) {
        html += ' <span class="inv-tree-name-count">(' + selCount + '/' + totCount + ')</span>';
      }
      html += '</span>';
      html += '<span class="inv-tree-act" style="width:56px;font-size:13px">' + node.activities + '</span>';
      html += '<span class="inv-tree-rec" style="width:56px;font-size:13px">' + numberFmt(node.records) + '</span>';
      html += '</div>';

      if (hasChildren) {
        html += '<div class="inv-tree-children' + (isExpanded ? ' inv-tree-children--open' : '') + '" data-ws-at-children="' + node.id + '">';
        html += buildAssignEntityTreeHTML(node.children, depth + 1, ctx);
        html += '</div>';
      }
    });
    return html;
  }

  // ---- Assign: activity columns (right panel) ----

  function buildAssignColumnsHTML(ctx) {
    var checkedIds = getCheckedEntityIds(ctx);

    if (checkedIds.length === 0) {
      return '<div style="font-family:\'Nunito Sans\',sans-serif;font-size:14px;color:#676f73;padding:16px 0">' +
        'Select entities on the left to manage their activities</div>';
    }

    var groups = computeAssignGroups(ctx);

    // Left: Add activities
    var leftHTML = '<div class="inv-activity-col" style="padding-right:16px">';
    leftHTML += '<div class="inv-activity-col-title">Add activities</div>';

    if (groups.available.length === 0) {
      leftHTML += '<div style="font-size:13px;color:#676f73;padding:4px 0">All activities assigned</div>';
    } else {
      groups.available.forEach(function (a) {
        var sc = scopeClass(a);
        leftHTML +=
          '<div class="inv-activity-row ws-assign-row ws-assign-row--add" data-ws-assign-add="' + a.id + '">' +
            '<span class="inv-activity-row-name">' + esc(a.name) + '</span>' +
            '<span class="inv-scope-badge ' + sc + '">Scope ' + a.scope + '</span>' +
            '<button class="ws-add-btn" title="Add to selected entities"><i class="fa-solid fa-plus"></i></button>' +
          '</div>';
      });
    }
    leftHTML += '</div>';

    // Right: Assigned activities grouped
    var rightHTML = '<div class="inv-activity-col" style="padding-left:16px;border-left:1px solid #d5dde0">';
    var hasAny = false;

    // Shared group
    if (groups.shared.length > 0) {
      hasAny = true;
      var label = checkedIds.length === 2
        ? 'Activities in both entities'
        : 'Activities in all ' + checkedIds.length + ' entities';
      rightHTML += '<div class="inv-activity-col-title">' + esc(label) + '</div>';
      groups.shared.forEach(function (a) {
        var sc = scopeClass(a);
        rightHTML +=
          '<div class="inv-activity-row ws-assign-row ws-assign-row--remove" data-ws-assign-remove-shared="' + a.id + '">' +
            '<span class="inv-activity-row-name">' + esc(a.name) + '</span>' +
            '<span class="inv-scope-badge ' + sc + '">Scope ' + a.scope + '</span>' +
            '<button class="ws-remove-btn" title="Remove from all selected entities"><i class="fa-solid fa-xmark"></i></button>' +
          '</div>';
      });
    }

    // Per-entity groups
    checkedIds.forEach(function (eid) {
      if (groups.perEntity[eid] && groups.perEntity[eid].length > 0) {
        hasAny = true;
        var path = getEntityPath(eid, ctx.entityTree);
        rightHTML += '<div class="inv-activity-col-title" style="margin-top:12px">Activities only in ' + esc(path) + '</div>';
        groups.perEntity[eid].forEach(function (a) {
          var sc = scopeClass(a);
          rightHTML +=
            '<div class="inv-activity-row ws-assign-row ws-assign-row--remove" data-ws-assign-remove-one="' + a.id + '" data-ws-entity-id="' + eid + '">' +
              '<span class="inv-activity-row-name">' + esc(a.name) + '</span>' +
              '<span class="inv-scope-badge ' + sc + '">Scope ' + a.scope + '</span>' +
              '<button class="ws-remove-btn" title="Remove from ' + esc(path) + '"><i class="fa-solid fa-xmark"></i></button>' +
            '</div>';
        });
      }
    });

    if (!hasAny) {
      rightHTML += '<div style="font-size:13px;color:#676f73;padding:4px 0">No activities assigned yet</div>';
    }

    rightHTML += '</div>';
    return '<div class="inv-activity-columns">' + leftHTML + rightHTML + '</div>';
  }

  function refreshAssignColumns(ctx) {
    var container = document.getElementById(ctx.prefix + '-assign-cols');
    if (container) {
      container.innerHTML = buildAssignColumnsHTML(ctx);
      bindAssignToggles(ctx);
    }
  }

  function bindAssignToggles(ctx) {
    var b = ctx.body;

    // "+" add to all checked entities
    b.querySelectorAll('[data-ws-assign-add]').forEach(function (row) {
      row.addEventListener('click', function () {
        var actId = this.dataset.wsAssignAdd;
        getCheckedEntityIds(ctx).forEach(function (eid) {
          if (!ctx.entityActivities[eid]) ctx.entityActivities[eid] = {};
          ctx.entityActivities[eid][actId] = true;
        });
        refreshAssignColumns(ctx);
      });
    });

    // "x" remove from all checked entities (shared row)
    b.querySelectorAll('[data-ws-assign-remove-shared]').forEach(function (row) {
      row.addEventListener('click', function () {
        var actId = this.dataset.wsAssignRemoveShared;
        getCheckedEntityIds(ctx).forEach(function (eid) {
          if (ctx.entityActivities[eid]) delete ctx.entityActivities[eid][actId];
        });
        refreshAssignColumns(ctx);
      });
    });

    // "x" remove from one specific entity
    b.querySelectorAll('[data-ws-assign-remove-one]').forEach(function (row) {
      row.addEventListener('click', function () {
        var actId = this.dataset.wsAssignRemoveOne;
        var eid = this.dataset.wsEntityId;
        if (ctx.entityActivities[eid]) delete ctx.entityActivities[eid][actId];
        refreshAssignColumns(ctx);
      });
    });
  }

  // ---- Assign: full step content + bindings ----

  function buildAssignContent(ctx) {
    var p = ctx.prefix;
    var leftTreeHTML = buildAssignEntityTreeHTML(ctx.entityTree, 0, ctx);
    var colsHTML = buildAssignColumnsHTML(ctx);

    return '<div class="inv-filter-split">' +
      '<div class="inv-filter-left">' +
        '<div class="inv-tree-header" style="font-size:13px">' +
          '<span class="inv-tree-header-entity">Entities</span>' +
          '<span class="inv-tree-header-act" style="width:56px">Activities</span>' +
          '<span class="inv-tree-header-rec" style="width:56px">Records</span>' +
        '</div>' +
        '<div class="inv-tree-wrap" style="padding:8px">' + leftTreeHTML + '</div>' +
      '</div>' +
      '<div class="inv-filter-right">' +
        '<div class="inv-filter-right-header">' +
          '<input type="text" class="inv-filter-search" placeholder="Filter activities">' +
        '</div>' +
        '<div id="' + p + '-assign-cols" class="inv-assign-cols-wrap">' + colsHTML + '</div>' +
      '</div>' +
    '</div>';
  }

  function refreshAssignTreeUI(ctx) {
    ctx.body.querySelectorAll('.inv-tree-cb[data-ws-at-cb]').forEach(function (cb) {
      var id = cb.dataset.wsAtCb;
      var eligible = isEntityEligible(findNode(id, ctx.entityTree) || { id: id }, ctx);
      cb.checked = !!ctx.assignEntityChecked[id];
      cb.disabled = !eligible;
    });
  }

  function bindAssignStep(ctx) {
    var b = ctx.body;

    // Tree expand/collapse
    b.querySelectorAll('.inv-tree-toggle[data-ws-at-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.dataset.wsAtToggle;
        ctx.entityExpanded[id] = !ctx.entityExpanded[id];
        var childrenEl = b.querySelector('[data-ws-at-children="' + id + '"]');
        if (childrenEl) childrenEl.classList.toggle('inv-tree-children--open');
        this.classList.toggle('inv-tree-toggle--collapsed', !ctx.entityExpanded[id]);
      });
    });

    // Tree checkbox with cascading
    b.querySelectorAll('.inv-tree-cb[data-ws-at-cb]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = this.dataset.wsAtCb;
        var checked = this.checked;
        ctx.assignEntityChecked[id] = checked;
        var node = findNode(id, ctx.entityTree);
        if (node) {
          (function cascade(n) {
            if (n.children) {
              n.children.forEach(function (c) {
                if (isEntityEligible(c, ctx)) ctx.assignEntityChecked[c.id] = checked;
                cascade(c);
              });
            }
          })(node);
        }
        refreshAssignTreeUI(ctx);
        refreshAssignColumns(ctx);
      });
    });

    // Activity add/remove buttons
    bindAssignToggles(ctx);
  }

  // ===========================================
  // REVIEW HELPERS
  // ===========================================

  function countEntitiesSelected(ctx) {
    var count = 0;
    function walk(nodes) {
      nodes.forEach(function (n) {
        if (ctx.entitySelections[n.id]) count += (n.total > 0 ? n.total : 1);
        if (n.children) walk(n.children);
      });
    }
    walk(ctx.entityTree);
    return count;
  }

  function buildActivitiesReviewChips(ctx) {
    var selected = ctx.activities.filter(function (a) { return ctx.activitySelections[a.id]; });
    var html = '';
    selected.forEach(function (a) {
      var sc = scopeClass(a);
      html += '<span class="inv-review-chip">' + esc(a.name) +
        ' <span class="inv-scope-badge ' + sc + '" style="margin-left:6px;font-size:11px;padding:1px 6px">S' + a.scope + '</span></span>';
    });
    return { html: html, count: selected.length };
  }

  function buildAssignReviewSummary(ctx) {
    var totalAssignments = 0;
    var entitiesWithActivities = 0;
    for (var eid in ctx.entityActivities) {
      var count = 0;
      for (var aid in ctx.entityActivities[eid]) {
        if (ctx.entityActivities[eid][aid]) count++;
      }
      if (count > 0) {
        entitiesWithActivities++;
        totalAssignments += count;
      }
    }
    return { totalAssignments: totalAssignments, entitiesWithActivities: entitiesWithActivities };
  }

  // ===========================================
  // PUBLIC API
  // ===========================================

  return {
    esc: esc,
    numberFmt: numberFmt,
    countSelected: countSelected,
    countTotal: countTotal,
    findNode: findNode,
    getTotals: getTotals,
    buildStatsBar: buildStatsBar,
    refreshStatsBar: refreshStatsBar,
    buildEntitiesContent: buildEntitiesContent,
    bindEntitiesStep: bindEntitiesStep,
    buildActivitiesContent: buildActivitiesContent,
    bindActivitiesStep: bindActivitiesStep,
    initAssignStep: initAssignStep,
    buildAssignContent: buildAssignContent,
    bindAssignStep: bindAssignStep,
    countEntitiesSelected: countEntitiesSelected,
    buildActivitiesReviewChips: buildActivitiesReviewChips,
    buildAssignReviewSummary: buildAssignReviewSummary
  };

})();
