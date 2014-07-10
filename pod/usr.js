//pod/usr.js

YUI.add('j-pod-usr',function(Y){
    'use strict';
    Y.namespace('J.pod').usr=function(cfg){

        cfg=Y.merge({
            title :'my profile'
        },cfg);

        this.info={
            id         :'usr',
            title      :cfg.title,
            description:'Individual details',
            file       :'/pod/usr.js',
            version    :'v1.1 May 2014'
        };

        var self=this,
            d={},
            h={
                list:{},   //tag lists
                pl  :null, //main panel
                pn  :{},   //panels
                tv  :null  //tabview
            },
            //functions
            initialise={},
            io={},
            listeners,
            pod={},
            populate={},
            record={},
            render={},
            rs={}
        ;

        this.customEvent={
            save:self.info.id+(++J.env.customEventSequence)+':save'
        };

        this.display=function(p){
            cfg=Y.merge(cfg,p);
            h.pl.show();
            io.fetch.usr();
        };

        this.get=function(what){
        };
        this.set=function(what,value){
            if(what==='cfg'){cfg=Y.merge(cfg,value);}
        };

        this.my={}; //children

        /**
         * private
         */
        initialise=function(){
            h.pl.get('boundingBox').addClass('j-pod-'+self.info.id);
        };

        io={
            fetch:{
                usr:function(){
                    Y.io('/db/usr_s.php',{
                        method:'POST',
                        on:{complete:function(id,o){Y.fire('db-usr:available',Y.JSON.parse(o.responseText)[0].result);}},
                        data:Y.JSON.stringify([{criteria:{
                           usrIds:[J.user.usr.id]
                        }}])
                    });
                }
            },
            save:function(){
                var usrId=J.user.usr.id,
                    usr={
                        records:[{
                            data:{
                                id           :usrId,
                                title        :h.pl.bodyNode.one('.j-data-title'    ).get('value'),
                                firstName    :h.pl.bodyNode.one('.j-data-firstName').get('value'),
                                lastName     :h.pl.bodyNode.one('.j-data-lastName' ).get('value'),
                                knownAs      :h.pl.bodyNode.one('.j-data-knownAs'  ).get('value')
                            },
                            children:{
                                address:{
                                    records:[],
                                    remove:h.pn.addr.getData('removeIds')||[]
                                },
                                info:{
                                    records:[],
                                    remove:h.pn.info.getData('removeIds')||[]
                                },
                                tag:{
                                    records:[],
                                    remove:['skill','profile','interest']
                                }
                            }
                        }]
                    }
                ;
                //remove usr
/*
                if(){
                        remove:[] //>>>>>>FINISH h.removeMe.get('checked'),
                    usr.remove=[usrId];
                    delete usr.records;
                }
*/
                //info
                    h.pn.info.all('>div').each(function(n,i){
                        var data=n.getData('data'),
                            r={data:{
                                dbTable :'usr',
                                pk      :usrId,
                                seq     :i,
                                category:n.one('.j-data-category').get('value'),
                                detail  :n.one('.j-data-detail').get('value')
                            }}
                        ;
                        if(data!==undefined){
                            r.data.id=data.id;
                        }
                        usr.records[0].children.info.records.push(r);
                    });
                //tags
                    Y.each(h.list.usrSkillTags.get('selected'),function(tag,i){
                        usr.records[0].children.tag.records.push({data:{
                            dbTable :'usr',
                            pk      :usrId,
                            seq     :i,
                            category:'skill',
                            tag     :tag
                        }});
                    });
                    Y.each(h.list.usrProfileTags.get('selected'),function(tag,i){
                        usr.records[0].children.tag.records.push({data:{
                            dbTable :'usr',
                            pk      :usrId,
                            seq     :i,
                            category:'profile',
                            tag     :tag
                        }});
                    });
                    Y.each(h.list.usrInterestTags.get('selected'),function(tag,i){
                        usr.records[0].children.tag.records.push({data:{
                            dbTable :'usr',
                            pk      :usrId,
                            seq     :i,
                            category:'interest',
                            tag     :tag
                        }});
                    });
                //address
                    h.pn.addr.all('>div').each(function(n,i){
                        var data=n.getData('data'),
                            r={data:{
                                dbTable :'usr',
                                pk      :usrId,
                                seq     :i,
                                purpose :n.one('.j-data-purpose' ).get('value'),
                                location:(parseInt(n.one('.j-data-location').get('value'),10)||null),
                                detail  :n.one('.j-data-detail'  ).get('value')
                            }}
                        ;
                        if(data!==undefined){
                            r.data.id=data.id;
                        }
                        usr.records[0].children.address.records.push(r);
                    });
                    
                Y.io('/db/usr_u.php',{
                    method:'POST',
                    on:{complete:io.fetch.usr},
                    data:Y.JSON.stringify([{usr:usr}])
                });
            }
        };

        listeners=function(){
            h.tv.get('contentBox').one('.yui3-tabview-list' ).delegate('click',record.prepend,'.j-add');
            h.tv.get('contentBox').one('.yui3-tabview-panel').delegate('click',record.append ,'.j-add');
            h.tv.get('contentBox').one('.yui3-tabview-panel').delegate('click',record.remove ,'.j-remove');
            h.pl.bodyNode.one('.j-save').on('click',io.save);
            //custom
                Y.on('db-usr:available',populate.usr);
                Y.on('j:logout',function(){h.pl.destroy();});
        };

        pod={
            display:{
                grp:function(p){
                    if(!self.my.podGrp){pod.load.grp(p);return false;}
                    self.my.podGrp.display(p);
                }
            },
            load:{
                grp:function(p){
                    Y.use('j-pod-grp',function(Y){
                        self.my.podGrp=new Y.J.pod.grp(p);
                        Y.J.whenAvailable.inDOM(self,'my.podGrp',function(){
                            pod.display.grp(p);
                            self.my.podGrp.pl.on('visibleChange',function(e){
                                if(!e.newVal){ //hidden
                                    
                                }
                            });
                        });
                    });
                }
            },
            result:{
            }
        };

        populate={
            usr:function(rs){
                var usr=Y.J.firstRecord(rs.usr.data),
                    nn,sortInfo=[],
                    usrTags={}
                ;
                h.pl.bodyNode.one('.j-data-id'       ).set('value',usr.id);
                h.pl.bodyNode.one('.j-data-title'    ).set('value',usr.title);
                h.pl.bodyNode.one('.j-data-firstName').set('value',usr.firstName);
                h.pl.bodyNode.one('.j-data-lastName' ).set('value',usr.lastName);
                h.pl.bodyNode.one('.j-data-knownAs'  ).set('value',usr.knownAs);

                h.pn.info.set('innerHTML','');
                h.pn.addr.set('innerHTML','');
                h.pn.grp.set('innerHTML' ,'<p>To request membership go to the group module</p>');

                //info order by seq
                    Y.each(rs.info.data,function(info){sortInfo.push(info);});
                    sortInfo.sort(function(a,b){return a.seq-b.seq;});
                    Y.each(sortInfo,function(info){
                        nn=render.info();
                        h.pn.info.append(nn);
                        nn.setData('data',info);
                        nn.one('.j-data-category').set('value',info.category);
                        nn.one('.j-data-detail'  ).set('value',info.detail);
                    });
                //user tags
                    Y.each(rs.usrTags.data,function(tag){
                        if(usrTags[tag.category]===undefined){usrTags[tag.category]=[];}
                        usrTags[tag.category].push(tag.name);
                    });
                    Y.each(usrTags,function(tagGroup,tagCategory){
                        var grpCategory='usr'+tagCategory.charAt(0).toUpperCase()+tagCategory.slice(1)+'Tags'
                        ;
                        if(h.list[grpCategory]!==undefined){h.list[grpCategory].set('selected',tagGroup);}
                    });
                //address
                    Y.each(rs.address.data,function(address){
                        nn=render.address();
                        h.pn.addr.append(nn);
                        nn.setData('data',address);
                        nn.one('.j-data-purpose'     ).set('value',address.purpose);
                        nn.one('.j-data-detail'      ).set('value',address.detail);
                        nn.one('.j-data-location'    ).set('value',address.location);
                        nn.one('.j-data-locationName').set('value',rs.location.data[address.location].name);
                    });
                //groups
                    Y.each(rs.grp.data,function(grp){
                        var tags=[]
                        ;
                        nn=render.grp();
                        h.pn.grp.append(nn);
                        nn.setData('data',grp);
                        //group tags
                            Y.each(rs.grpTags.data,function(grpTag){
                                if(grpTag.pk===grp.id){tags.push(grpTag.tag);}
                            });
                        nn.set('innerHTML','<strong>'+grp.name+'</strong> '+(grp.restrict===0?'Public':'Private')+'('+tags.join(',')+')');
                    });



            }
        };

        record={
            append:function(){
                var rec=this.ancestor('.j-record'),
                    recSet=rec.ancestor('.j-dataSet').getAttribute('data-dataset')
                ;
                if(recSet==='address'){rec.insert(render.address(),'after');}
                if(recSet==='info'   ){rec.insert(render.info()   ,'after');}
            },
            prepend:function(){
                if(this.hasClass('j-add-address')){h.pn.addr.prepend(render.address());}
                if(this.hasClass('j-add-info'   )){h.pn.info.prepend(render.info());}
            },
            remove:function(){
                var rec=this.ancestor('.j-record'),
                    recSet=rec.ancestor('.j-dataSet'),
                    data=rec.getData('data'),
                    ids=recSet.getData('removeIds')||[]
                ;
                if(data!==undefined){
                    ids.push(data.id);
                    recSet.setData('removeIds',ids);
                }
                rec.remove();
            }
        };

        render={
            base:function(){
                h.pl=new Y.Panel({
                    headerContent:
                        '<span title="pod:'+self.info.id+' '+self.info.version+' '+self.info.description+'">'+self.info.title+'</span>',
                    bodyContent:
                         '<input class="j-data j-data-id"        type="hidden" /> '
                        +'<input class="j-data j-data-title"     placeholder="title"      title="mr/mrs/miss/sir..." /> '
                        +'<input class="j-data j-data-firstName" placeholder="first name" title="first name" /> '
                        +'<input class="j-data j-data-lastName"  placeholder="last name"  title="last name" /> '
                        +'<input class="j-data j-data-knownAs"   placeholder="known as"   title="also known as" />'
                        +Y.J.html('btn',{action:'save',label:'save details'}),
                    modal   :true,
                    visible :false,
                    width   :parseInt(Y.one('body').getComputedStyle('width'),10)-80,
                    xy      :[40,30],
                    zIndex  :9
                })
                .plug(Y.Plugin.Drag,{handles:['.yui3-widget-hd']})
                .plug(Y.Plugin.Resize)
                .render();

                h.tv=new Y.TabView({
                    children:[
                        {label:'info'+Y.J.html('btn',{action:'add',title:'add record',classes:'j-add-info'}),content:''},
                        {label:'likes',
                         content:'<div class="j-tags j-tags-skills"></div>'
                                +'<div class="j-tags j-tags-profile"></div>'
                                +'<div class="j-tags j-tags-interests"></div>'
                        },
                        {label:'address'+Y.J.html('btn',{action:'add',title:'add record',classes:'j-add-address'}),content:''},
                        {label:'groups' ,content:''},
                        {label:'public' ,content:
                            '<strong>Your public profile.</strong> '
                           +'<em>Enter only those details you are happy for anyone to view. If you are a contact for your group then public contact information would help when people have enquiries.</em><br/>'
                           +'<textarea class="j-data-publicProfile" title="your public profile" placeholder="public profile"></textarea><br/>'
                           +'<strong>Your community profile.</strong> '
                           +'<em>Enter those details you are happy for other members of groups you belong to, to view. This is particularly helpful when you request membership in any other group.</em><br/>'
                           +'<textarea class="j-data-groupProfile" title="your group profile" placeholder="group profile"></textarea>'
                       },
                        {label:'actions',content:
                            '<h2>work in progress</h2>'
                           +'<ul>'
                           +  '<li>change password</li>'
                           +  '<li>leave group - ask for reason</li>'
                           +  '<li>leave private group - ask for reason</li>'
                           +  '<li>suspend account - ask for reason</li>'
                           +'</ul>'
                           +'<p>Notes: Must terminate each group membership before suspending account.  Display "terminate my account" button only when no memberships exist, however, have this explaination by the disabled button.</p>'
                        }
                    ]
                }).render(h.pl.bodyNode);
                //shortcuts
                    h.pn={
                        info:h.tv.item(0).get('panelNode'),
                        like:h.tv.item(1).get('panelNode'),
                        addr:h.tv.item(2).get('panelNode'),
                        grp :h.tv.item(3).get('panelNode'),
                        pub :h.tv.item(4).get('panelNode'),
                        act :h.tv.item(5).get('panelNode')
                    }
                //identify
                    h.pn.info.addClass('j-dataSet j-dataSet-info').setAttribute('data-dataset','info');
                    h.pn.like.addClass('j-dataSet j-dataSet-prof').setAttribute('data-dataset','tag');
                    h.pn.addr.addClass('j-dataSet j-dataSet-addr').setAttribute('data-dataset','address');
                    h.pn.grp .addClass('j-dataSet j-dataSet-grp' ).setAttribute('data-dataset','grp');

                h.list.usrSkillTags=new Y.J.widget.List({
                    title   :'My skills',
                    elements:[{id:'communication',name:'communication'},
                              {id:'leadership'   ,name:'leadership'},
                              {id:'financial'    ,name:'financial'},
                              {id:'marketing'    ,name:'marketing'},
                              {id:'IT'           ,name:'IT/computer'}],
                    selectorPrompt:'+skills'
                }).render(h.pn.like.one('.j-tags-skills'));
                h.list.usrProfileTags=new Y.J.widget.List({
                    elements:[{id:'mentor'   ,name:'mentor'},
                              {id:'young'    ,name:'young at heart'},
                              {id:'volunteer',name:'volunteering'},
                              {id:'helper'   ,name:'helper'}],
                    selectorPrompt:'+profile'
                }).render(h.pn.like.one('.j-tags-profile'));
                h.list.usrInterestTags=new Y.J.widget.List({
                    title   :'My interests',
                    elements:[{id:'adventure' ,name:'adventure'},
                              {id:'collecting',name:'collecting'},
                              {id:'computers' ,name:'computers'},
                              {id:'health'    ,name:'health & wellbeing'},
                              {id:'intellect' ,name:'intellectual'},
                              {id:'outdoors'  ,name:'outdoors'},
                              {id:'social'    ,name:'socialising'},
                              {id:'speaking'  ,name:'public speaking'},
                              {id:'sports'    ,name:'sports'}],
                    selectorPrompt:'+interests'
                }).render(h.pn.like.one('.j-tags-interests'));

            },
            address:function(){
                var nn=Y.Node.create(
                        '<div class="j-record">'
                       +  '<select class="j-data j-data-purpose">'
                       +    '<option>Physical</option>'
                       +    '<option>Postal</option>'
                       +  '</select>'
                       +  '<textarea class="j-data j-data-detail" placeholder="detail" title="detail"></textarea>'
                       +  Y.J.html('btn',{action:'add',title:'add record'})
                       +  Y.J.html('btn',{action:'remove',title:'remove record'})
                       +  '<br/>'
                       +  '<input type="hidden" class="j-data j-data-location" />'
                       +  '<input type="text" class="j-data j-data-locationName" placeholder="nearest location" title="nearest location" />'
                       +'</div>'
                    )
                ;
                //auto complete
                    nn.one('.j-data-locationName').plug(Y.Plugin.AutoComplete,{
                        activateFirstItem:true,
                        minQueryLength:2,
                        queryDelay:300,
                        resultFilters:'startsWith',
                        resultHighlighter:'wordMatch',
                        resultTextLocator:function(result){return result[1]+' ('+result[3]+')';},
                        after:{
                            results:function(e){
                                nn.one('.j-data-location').set('value','');
                                if(e.data.length===1){this.selectItem();}
                            }
                        },
                        on:{
                            query:function(e){
                                this.set('source','/db/acLocation.php?location={query}');
                            },
                            select:function(e){
                                nn.one('.j-data-location').set('value',e.result.raw[0]);
                                nn.one('.j-data-locationName').simulate('change');
                            }
                        }
                    });
                return nn;
            },
            grp:function(){
                return Y.Node.create(
                    '<div class="j-record"></div>'
                );
            },
            info:function(){
                return Y.Node.create(
                    '<div class="j-record">'
                   +  '<select class="j-data j-data-category">'
                   +    '<optgroup label="contact details">'
                   +      '<option>Phone</option>'
                   +      '<option>Mobile</option>'
                   +      '<option>Email</option>'
                   +      '<option>Skype</option>'
                   +      '<option>Facebook</option>'
                   +      '<option>Other</option>'
                   +    '</optgroup>'
                   +    '<optgroup label="gender">'
                   +      '<option>Male</option>'
                   +      '<option>Female</option>'
                   +    '</optgroup>'
                   +    '<optgroup label="miscellaneous">'
                   +      '<option>Interest</option>'
                   +      '<option>Likes</option>'
                   +      '<option>Dislikes</option>'
                   +    '</optgroup>'
                   +    '<option>Other</option>'
                   +  '</select>'
                   +  '<input type="text" class="j-data j-data-detail" placeholder="detail" title="detail" />'
                   +  Y.J.html('btn',{action:'add',title:'add record'})
                   +  Y.J.html('btn',{action:'remove',title:'remove record'})
                   +'</div>'
                );
            }
        };

        render.base();
        initialise();
        listeners();

    };

},'1.1 May 2014',{requires:['base','io','node']});
