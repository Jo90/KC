/** /kc/inc/init.js.php
 *
 *  javascript initialisation
 */
//namespace KC
if(!window.KC){KC={};}
if(!KC.data)  {KC.data={};} //data stores
if(!KC.env)   {KC.env={};}  //environment
if(!KC.my)    {KC.my={};}   //instantiated objects
if(!KC.std)   {KC.std={};}  //standards
if(!KC.tmp)   {KC.tmp={};}
if(!KC.user)  {KC.user={};} //user info
/**
 * global constants
 */
KC.env.server='<?php echo KC_SERVER; ?>';
KC.env.fileserver='<?php echo KC_FILESERVER; ?>';
KC.env.device='<?php echo KC_ENV_DEVICE; ?>';
KC.env.customEventSequence=0; //sequence to help generate unqiue custom events
//maintained by /assets/mod/contactOrganistionRole.js
KC.env.currentTeam=null;
KC.env.currentTeamRole=null;
KC.env.currentRole=null;
//standards
KC.std.format_date    ='d MMM yyyy';
KC.std.format_dateDM  ='d MMM';
KC.std.format_dateDMY ='ddMMyy';
KC.std.format_datetime='dMMMyy h:mmtt';
KC.std.format_time    ='h:mmtt';
