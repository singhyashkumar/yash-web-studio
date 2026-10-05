const briefDialog = document.querySelector('#brief-dialog');
document.querySelector('#open-brief')?.addEventListener('click', () => briefDialog.showModal());
document.querySelector('[data-close]')?.addEventListener('click', () => briefDialog.close());
document.querySelector('#brief-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const text = `PROJECT BRIEF\n\nBusiness: ${fields.get('business')}\nProject: ${fields.get('type')}\n\nGoals and features:\n${fields.get('goals')}\n\nPreferred timing: ${fields.get('timing') || 'To be agreed'}\n\nScope, price, and delivery date to be agreed before work begins.\n`;
  const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
  const link = Object.assign(document.createElement('a'), {href:url,download:'project-brief.txt'});
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  briefDialog.close();
});
