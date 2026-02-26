// ========================================
// SHARED WIZARD STEPS — Base
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
//
// Load order: wizard-steps.js → wizard-steps-tree.js → wizard-steps-activities.js
// ========================================

window.WizardSteps = (function () {

  // ===========================================
  // UTILITIES
  // ===========================================

  var esc = window.DomUtils.esc;

  function numberFmt(n) {
    if (typeof n !== 'number') return n;
    return n.toLocaleString();
  }

  function scopeClass(a) {
    return a.scope === 1 ? 'inv-scope-badge--s1' : a.scope === 2 ? 'inv-scope-badge--s2' : 'inv-scope-badge--s3';
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

    var byScope = {};
    selected.forEach(function (a) {
      if (!byScope[a.scope]) byScope[a.scope] = [];
      byScope[a.scope].push(a);
    });
    var scopeKeys = Object.keys(byScope).sort();
    scopeKeys.forEach(function (k) {
      byScope[k].sort(function (a, b) { return a.name.localeCompare(b.name); });
    });
    var maxCount = 0;
    scopeKeys.forEach(function (k) { if (byScope[k].length > maxCount) maxCount = byScope[k].length; });

    var columnsHtml = '';
    scopeKeys.forEach(function (k) {
      var wide = byScope[k].length === maxCount && maxCount > 6;
      columnsHtml += '<div class="inv-review-col' + (wide ? ' inv-review-col--wide' : '') + '">';
      columnsHtml += '<div class="inv-review-col-title">Scope ' + k + '</div>';
      columnsHtml += '<div class="inv-review-col-chips' + (wide ? ' inv-review-col-chips--2col' : '') + '">';
      byScope[k].forEach(function (a) {
        columnsHtml += '<span class="inv-review-chip">' + esc(a.name) + '</span>';
      });
      columnsHtml += '</div>';
      columnsHtml += '</div>';
    });

    return { html: html, columnsHtml: columnsHtml, count: selected.length };
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
  // PUBLIC API — extended by tree and activities modules
  // ===========================================

  return {
    esc: esc,
    numberFmt: numberFmt,
    scopeClass: scopeClass,
    getTotals: getTotals,
    buildStatsBar: buildStatsBar,
    refreshStatsBar: refreshStatsBar,
    countEntitiesSelected: countEntitiesSelected,
    buildActivitiesReviewChips: buildActivitiesReviewChips,
    buildAssignReviewSummary: buildAssignReviewSummary
  };

})();
