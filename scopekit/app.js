'use strict';
const $=id=>document.getElementById(id);
const rules=[
 {match:/\b(website|landing|web page|webpage|site)\b/i,title:'Responsive page layout',check:'Confirm the number of pages and sections. Test the agreed layouts on mobile and desktop; verify navigation and content fit without horizontal scrolling.',question:'How many distinct pages and sections are included? Who supplies the copy and images?'},
 {match:/\b(contact|form|enquir\w*)\b/i,title:'Contact experience',check:'Agree on email/phone links versus a submitted form. Verify the agreed destination and error/success states using test data.',question:'Is a working backend form required, or are contact links sufficient? Who owns the destination inbox?'},
 {match:/\b(shop|ecommerce|e-commerce|payment|checkout|store)\b/i,title:'Commerce requirements review',check:'Confirm platform, product count, payment provider, shipping and tax responsibilities before estimating implementation. This item is discovery, not a promise to build checkout.',question:'Which commerce platform and payment provider are already available? Are fees and product entry included?'},
 {match:/\b(book\w*|appointment|calendar)\b/i,title:'Booking workflow definition',check:'Confirm link/embed versus a custom booking system. Document availability ownership, confirmation behavior and cancellation requirements.',question:'Can an existing booking service handle this, and who manages its subscription and availability?'},
 {match:/\b(logo|brand|identity|colou?r|font)\b/i,title:'Visual direction',check:'Confirm approved colors, typography and supplied assets. Agree on the number of design concepts and revisions.',question:'Are brand assets already supplied? Does the scope include logo creation or only applying existing branding?'},
 {match:/\b(bug|broken|fix|repair|error)\b/i,title:'Reproduce and verify the reported issue',check:'Record reproduction steps and expected behavior. Agree on affected browsers and pages; verify the fix against the same steps.',question:'Can you provide the current files, a reproducible example and permission to work on them?'},
 {match:/\b(login|account|sign.?in|auth\w*)\b/i,title:'Account and access requirements',check:'Document user roles, authentication provider and recovery flow. Agree on security review and test accounts before implementation.',question:'What roles and private data are involved, and which authentication service should own them?'},
 {match:/\b(seo|search engine|google)\b/i,title:'Basic search metadata',check:'Agree on titles, descriptions and indexing configuration. Confirm no ranking or traffic guarantee is included.',question:'Is this limited to on-page metadata, or does it include ongoing content and search work?'}
];
// Conservative phrase matching, not language understanding. Negative mentions
// become questions for review instead of silently becoming deliverables.
function inspectBrief(brief){
 return rules.map(rule=>{
  const mentions=[...brief.matchAll(new RegExp(rule.match.source,'gi'))].map(match=>{
   const before=brief.slice(0,match.index).split(/[.!?;\n]|\b(?:but|however)\b/i).pop();
   const negative=/\b(?:no|without|exclude|excluding|avoid|not|never|don't|do not|doesn't|does not|won't|will not)\s+(?:(?:need|want|require|include|any|a|an|the|custom|working|new|online|user|customer|automated)\s+)*$/i.test(before);
   const after=brief.slice(match.index+match[0].length);
   const negativeAfter=/^\s+(?:(?:system|functionality|feature|features|integration|processing)\s+)?(?:is|are)\s+not\s+(?:needed|required|included)\b/i.test(after);
   return {phrase:match[0],negative:negative||negativeAfter};
  });
  return {rule,positive:mentions.find(m=>!m.negative),negative:mentions.find(m=>m.negative)};
 }).filter(result=>result.positive||result.negative);
}
let items=[],questions=[];
function download(name,text,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function render(){
 $('plan').replaceChildren();
 items.forEach((item,index)=>{const card=document.createElement('div');card.className='deliverable';const row=document.createElement('div');row.className='row';
 const approved=document.createElement('input');approved.type='checkbox';approved.checked=item.confirmed;approved.setAttribute('aria-label',`Client confirmed deliverable ${index+1}`);approved.onchange=()=>{item.confirmed=approved.checked;updateCount()};
 const title=document.createElement('input');title.className='title';title.value=item.title;title.maxLength=200;title.setAttribute('aria-label',`Deliverable ${index+1} title`);title.oninput=()=>item.title=title.value;
 const remove=document.createElement('button');remove.className='remove';remove.textContent='×';remove.setAttribute('aria-label',`Remove deliverable ${index+1}`);remove.onclick=()=>{items.splice(index,1);render()};row.append(approved,title,remove);
 const label=document.createElement('label');label.textContent='Acceptance check';label.htmlFor=`check-${index}`;const check=document.createElement('textarea');check.id=label.htmlFor;check.value=item.check;check.maxLength=3000;check.oninput=()=>item.check=check.value;
 const evidence=document.createElement('div');evidence.className='evidence';evidence.textContent=item.evidence||'Manually added';card.append(row,label,check,evidence);$('plan').append(card)});
 $('questions').replaceChildren(...questions.map((q,index)=>{const li=document.createElement('li');const field=document.createElement('textarea');field.value=q;field.maxLength=3000;field.setAttribute('aria-label',`Open question ${index+1}`);field.oninput=()=>questions[index]=field.value;const remove=document.createElement('button');remove.textContent='Remove';remove.setAttribute('aria-label',`Remove question ${index+1}`);remove.onclick=()=>{questions.splice(index,1);render()};li.append(field,remove);return li}));updateCount();
}
function updateCount(){$('count').textContent=`${items.length} deliverables · ${items.filter(i=>i.confirmed).length} confirmed`}
function build(){const brief=$('brief').value.trim();if(!brief){$('status').textContent='Add a brief first, or try the sample.';$('brief').focus();return}if(items.length&&!confirm('Replace the current plan? Export or download a backup first if you want to keep your edits.'))return;
 const inspected=inspectBrief(brief),matched=inspected.filter(r=>r.positive);items=matched.map(({rule:r,positive,negative})=>({title:r.title,check:r.check,confirmed:false,evidence:`Suggested because the brief mentions “${positive.phrase}”.${negative?' A negative mention was also found; clarify the boundary before including this.':''}`}));
 if(!items.length)items=[{title:'Define the core deliverable',check:'Describe the exact output and a concrete demonstration that will show it works.',confirmed:false,evidence:'No keyword rules matched. Start with a manual scope.'}];
 questions=[...matched.map(r=>r.rule.question),...inspected.filter(r=>r.negative).map(r=>`The brief may exclude “${r.negative.phrase}”. Confirm the boundary for ${r.rule.title.toLowerCase()}${r.positive?' — it also contains a positive mention':''}.`),'What is the budget, deadline and revision limit?','Who approves the work, and what access and assets will they provide?'];render();$('status').textContent='Starting plan ready. Edit the suggestions; check an item only after your client confirms it.';
}
$('generate').onclick=build;
$('sample').onclick=()=>{if(items.length&&!confirm('Load the sample and replace your current work?'))return;items=[];$('project').value='Neighbourhood café website';$('brief').value='We need a small website for our café with a menu, contact details and a booking link. We have a logo but need it to work well on mobile. Ideally live next week.';$('boundaries').value='Hosting, domain registration, a custom booking backend and ongoing maintenance are not included unless separately agreed.';build()};
$('add').onclick=()=>{items.push({title:'New deliverable',check:'',confirmed:false});render()};
$('export').onclick=()=>{if(!items.length){$('status').textContent='Build or add a deliverable before exporting.';return}const text=`# ${$('project').value||'Project scope'}\n\nDraft for discussion — confirm scope before committing.\n\n## Brief\n${$('brief').value}\n\n## Deliverables\n${items.map(i=>`- [${i.confirmed?'x':' '}] ${i.title}\n  Acceptance: ${i.check}`).join('\n\n')}\n\n## Open questions\n${questions.map(q=>'- '+q).join('\n')}\n\n## Boundaries and assumptions\n${$('boundaries').value||'To be agreed.'}\n\nCreated with ScopeKit. Suggestions are keyword-based and require human review.\n`;download('scope-plan.md',text,'text/markdown');$('status').textContent='Plan exported. Review it before sharing with your client.'};
$('backup').onclick=()=>download('scopekit-backup.json',JSON.stringify({version:1,project:$('project').value,brief:$('brief').value,boundaries:$('boundaries').value,items,questions},null,2),'application/json');
$('restore').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>200000)throw Error('Backup is too large (maximum 200 KB).');const data=JSON.parse(await file.text());if(data.version!==1||!Array.isArray(data.items)||data.items.length>100||!Array.isArray(data.questions)||data.questions.length>100||!['project','brief','boundaries'].every(k=>typeof data[k]==='string')||!data.items.every(i=>i&&typeof i.title==='string'&&typeof i.check==='string'&&typeof i.confirmed==='boolean')||!data.questions.every(q=>typeof q==='string'))throw Error('This is not a valid ScopeKit backup.');if(items.length&&!confirm('Replace your current work with this backup?'))return;for(const k of ['project','brief','boundaries'])$(k).value=data[k];items=data.items.map(i=>({title:i.title,check:i.check,confirmed:i.confirmed,evidence:typeof i.evidence==='string'?i.evidence:''}));questions=data.questions;render();$('status').textContent='Backup restored.'}catch(err){$('status').textContent=err.message}finally{event.target.value=''}};

$('add-question').onclick=()=>{questions.push('New question');render()};

// Draft storage is opt-in and remains on this browser profile.
const draftKey='scopekit-draft-v1';
function saveDraft(){if(!$('remember').checked)return;try{localStorage.setItem(draftKey,JSON.stringify({version:1,project:$('project').value,brief:$('brief').value,boundaries:$('boundaries').value,items,questions}));$('save-state').textContent='Saved on this browser.'}catch{$('save-state').textContent='Browser storage unavailable. Download a backup to keep your work.'}}
$('remember').onchange=()=>{if($('remember').checked)saveDraft();else{try{localStorage.removeItem(draftKey);$('save-state').textContent='Saved copy removed. Current work stays open.'}catch{$('save-state').textContent='Could not remove saved copy. Clear this site’s browser storage.'}}};
document.addEventListener('input',saveDraft);
document.addEventListener('change',saveDraft);
document.addEventListener('click',()=>queueMicrotask(saveDraft));
try{const raw=localStorage.getItem(draftKey);if(raw){const d=JSON.parse(raw);if(d.version!==1||!['project','brief','boundaries'].every(k=>typeof d[k]==='string')||!Array.isArray(d.items)||d.items.length>100||!d.items.every(i=>i&&typeof i.title==='string'&&typeof i.check==='string'&&typeof i.confirmed==='boolean')||!Array.isArray(d.questions)||d.questions.length>100||!d.questions.every(q=>typeof q==='string'))throw Error('Invalid draft');for(const k of ['project','brief','boundaries'])$(k).value=d[k];items=d.items;questions=d.questions;$('remember').checked=true;render();$('status').textContent='Your saved draft is restored. Review it before sharing.'}}catch{$('save-state').textContent='Saved draft could not be loaded. Restore a downloaded backup if available.'}
