// ========================================
// SHARED WIZARD STEPS — Tree / Entity Hierarchy
// Extends window.WizardSteps with entity-tree builders and bindings.
// Depends on: wizard-steps.js (base)
// ========================================

(function () {

  var WS = window.WizardSteps;
  var esc = WS.esc;
  var numberFmt = WS.numberFmt;
  var scopeClass = WS.scopeClass;

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

      html += '<label class="inv-tree-label">';
      html += '<input type="checkbox" class="inv-tree-cb" data-ws-cb="' + node.id + '"' + (isChecked ? ' checked' : '') + '>';
      html += '<span class="inv-tree-name">' + esc(node.name);
      if (hasChildren || totCount > 0) {
        html += ' <span class="inv-tree-name-count">(' + selCount + '/' + totCount + ')</span>';
      }
      html += '</span>';
      html += '</label>';
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
        '<label class="inv-tree-header-entity inv-tree-label" style="display:flex;align-items:center;gap:8px">' +
          '<input type="checkbox" class="inv-tree-cb" id="' + p + '-select-all"' + selectAllChecked + '>' +
          'Entities <span class="inv-tree-name-count">(selected/total)</span>' +
        '</label>' +
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
  // ADD ACTIVITIES TO ENTITIES STEP (additive)
  // ===========================================

  function initAssignStep(ctx) {
    ctx.assignEntityChecked = {};
    ctx.entityActivities = {};

    var eligible = [];
    function walk(nodes) {
      nodes.forEach(function (n) {
        if (ctx.entitySelections[n.id]) eligible.push(n.id);
        if (n.children) walk(n.children);
      });
    }
    walk(ctx.entityTree);

    if (eligible.length < 2) return;

    var e1 = eligible[eligible.length - 2];
    var e2 = eligible[eligible.length - 1];
    ctx.assignEntityChecked[e1] = true;
    ctx.assignEntityChecked[e2] = true;

    var pool = ctx.activities.filter(function (a) { return ctx.activitySelections[a.id]; });
    if (pool.length < 6) return;

    ctx.entityActivities[e1] = {};
    ctx.entityActivities[e2] = {};

    ctx.entityActivities[e1][pool[2].id] = true;
    ctx.entityActivities[e2][pool[2].id] = true;
    if (pool.length > 12) {
      ctx.entityActivities[e1][pool[12].id] = true;
      ctx.entityActivities[e2][pool[12].id] = true;
    }

    ctx.entityActivities[e1][pool[0].id] = true;
    ctx.entityActivities[e1][pool[1].id] = true;

    ctx.entityActivities[e2][pool[4].id] = true;
    ctx.entityActivities[e2][pool[5].id] = true;
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

      html += '<label class="inv-tree-label">';
      html += '<input type="checkbox" class="inv-tree-cb" data-ws-at-cb="' + node.id + '"' +
        (isChecked ? ' checked' : '') + (eligible ? '' : ' disabled') + '>';
      html += '<span class="inv-tree-name" style="font-size:13px">' + esc(node.name);
      if (totCount > 0) {
        html += ' <span class="inv-tree-name-count">(' + selCount + '/' + totCount + ')</span>';
      }
      html += '</span>';
      html += '</label>';
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

    var rightHTML = '<div class="inv-activity-col" style="padding-left:16px;border-left:1px solid #d5dde0">';
    var hasAny = false;

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

    b.querySelectorAll('[data-ws-assign-remove-shared]').forEach(function (row) {
      row.addEventListener('click', function () {
        var actId = this.dataset.wsAssignRemoveShared;
        getCheckedEntityIds(ctx).forEach(function (eid) {
          if (ctx.entityActivities[eid]) delete ctx.entityActivities[eid][actId];
        });
        refreshAssignColumns(ctx);
      });
    });

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

    b.querySelectorAll('.inv-tree-toggle[data-ws-at-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.dataset.wsAtToggle;
        ctx.entityExpanded[id] = !ctx.entityExpanded[id];
        var childrenEl = b.querySelector('[data-ws-at-children="' + id + '"]');
        if (childrenEl) childrenEl.classList.toggle('inv-tree-children--open');
        this.classList.toggle('inv-tree-toggle--collapsed', !ctx.entityExpanded[id]);
      });
    });

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

    bindAssignToggles(ctx);
  }

  // ===========================================
  // EXTEND PUBLIC API
  // ===========================================

  WS.countSelected = countSelected;
  WS.countTotal = countTotal;
  WS.findNode = findNode;
  WS.buildEntitiesContent = buildEntitiesContent;
  WS.bindEntitiesStep = bindEntitiesStep;
  WS.initAssignStep = initAssignStep;
  WS.buildAssignContent = buildAssignContent;
  WS.bindAssignStep = bindAssignStep;

})();
