export const TUTORS = [
 {id:'linda',name:'Linda',tag:'Clear and structured',hi:'I like things clear and in order.'},
 {id:'charles',name:'Charles',tag:'Relaxed and practical',hi:'I like to keep things relaxed and practical.'}
];
export const LESSONS = {
 math:{title:'Balancing equations',applyLabel:'Balance an equation',learn:'An equation is a balance. Whatever you do to one side, you do to the other.',ex:'3x + 5 = 20  →  3x = 15  →  x = 5',
  apply:{q:'The lantern needs x units of power. 2x + 4 = 12. What is x?',o:['3','4','8'],a:1,why:'Subtract 4 from both sides to get 2x = 8, then divide by 2.'},
  recall:{q:'What is the first step in solving 2x + 4 = 12?',o:['Subtract 4 from both sides','Add 4 to both sides','Divide by 4'],a:0,why:'Undo the addition first so the x-term stands alone.'}},
 physics:{title:'Speed on the bridge',applyLabel:'Calculate the cart’s speed',learn:'Average speed is the total distance travelled divided by the total time taken.',ex:'60 m in 12 s  →  60 ÷ 12 = 5 m/s',
  apply:{q:'The cart crosses a 60 m bridge in 12 seconds. What is its average speed?',o:['5 m/s','12 m/s','720 m/s'],a:0,why:'Divide the total distance by the total time: 60 ÷ 12 = 5 m/s.'},
  recall:{q:'Which formula gives average speed?',o:['distance ÷ time','distance × time','time ÷ distance'],a:0,why:'Average speed tells you how much distance was covered per unit of time, on average.'}},
 chemistry:{title:'Change that lasts',applyLabel:'Identify a material change',learn:'In a physical change the substance stays the same. In a chemical change a new substance forms.',ex:'Ice melting → physical.  Wood burning → chemical.',
  apply:{q:'An iron panel for your gadget turns orange and flaky with rust. What kind of change is that?',o:['Physical','Chemical','Neither'],a:1,why:'Rust is a new substance that forms when iron reacts with oxygen in the presence of water.'},
  recall:{q:'Which of these is a physical change?',o:['Melting ice','Burning wood','Baking a cake'],a:0,why:'Melting only changes the state, not the substance.'}},
 biology:{title:'Power from light',applyLabel:'Predict what happens to a plant',learn:'Plants use light energy to make glucose from water and carbon dioxide. This is called photosynthesis.',ex:'carbon dioxide + water → glucose + oxygen (using light energy)',
  apply:{q:'The garden is kept in the dark for weeks. What can the plants no longer make?',o:['Glucose','Soil','Carbon dioxide'],a:0,why:'Without light, photosynthesis stops, so no glucose is made.'},
  recall:{q:'Which gas do plants take in for photosynthesis?',o:['Oxygen','Carbon dioxide','Nitrogen'],a:1,why:'Carbon dioxide is one of the raw materials.'}},
 english:{title:'Open with a topic sentence',applyLabel:'Choose a paragraph opening',learn:'A topic sentence tells the reader what a paragraph is about. It usually comes first.',ex:'Recycling saves energy. Making a can from old metal uses far less power…',
  apply:{q:'Which is the best topic sentence for a paragraph about recycling?',o:['Recycling helps protect the environment in three clear ways.','I went to the shop on Tuesday.','Cans are made of metal.'],a:0,why:'It names the topic and tells the reader what is coming.'},
  recall:{q:'Where does a topic sentence usually go?',o:['At the start of the paragraph','At the end of the book','In the middle of a sentence'],a:0,why:'Starting with it keeps the reader oriented.'}}
};
export const TROPHIES = [{d:10,tone:'bronze',name:'Bronze'},{d:30,tone:'silver',name:'Silver'},{d:50,tone:'gold',name:'Gold'},{d:100,tone:'diamond',name:'Diamond'}];
export const RIVALS = [['Amani',140],['Wanjiru',96],['Kip',52],['Zuri',33],['Otieno',12],['Naliaka',6]];

export const TRAIL_LESSONS = { chemistry: 'city', biology: 'rainforest' };

export const TUTOR_HELP = {
  math: {
    linda: ['Keep an equation balanced by applying the same operation to both sides.', 'Undo the added power first, then find the size of one equal share.', 'Look for the operation that will leave 2x on its own.'],
    charles: ['Picture two pans on a scale. Remove the same weight from both and they stay level.', 'Set aside the four extra units. Split what remains between the two equal parts.', 'Which move cancels the extra four on the left?'],
  },
  physics: {
    linda: ['Average speed is the total distance divided by the total time.', 'Share the 60 metres equally across the 12 seconds.', 'Choose the operation that gives metres per second.'],
    charles: ['Ask how many metres the cart covers in one second on average.', 'Think of the crossing as 12 equal time slots. How many metres go into each?', 'If the time doubles for the same distance, the speed should go down. Which formula does that?'],
  },
  chemistry: {
    linda: ['Compare the substance before and after the change. Changing its state can leave its identity intact.', 'Compare the original metal with the orange material that forms on its surface.', 'Look for an example where the same substance is still present afterward.'],
    charles: ['Ice and the puddle it leaves behind are both water. Rust on metal is a different material.', 'The orange flakes formed while the gate was exposed to air and moisture. What formed?', 'Which example changes how a material looks or flows while keeping the same substance?'],
  },
  biology: {
    linda: ['Plants use light energy to make glucose from water and carbon dioxide.', 'Without light energy, consider which product of photosynthesis the plant cannot make.', 'The plant uses a gas from the air as a raw material and releases oxygen.'],
    charles: ['Think of a leaf as a small sugar factory powered by light.', 'The dark cuts off the factory’s power. What does that factory usually make?', 'One of the gases in the choices goes into the leaf to help make sugar. Which one?'],
  },
  english: {
    linda: ['A topic sentence names the paragraph’s main idea and prepares the reader for the details.', 'Choose the sentence that introduces the whole paragraph about recycling.', 'Think about where the reader first needs to know what the paragraph is about.'],
    charles: ['A topic sentence tells you what the rest of the paragraph is going to talk about.', 'Which sentence could you follow with three examples of how recycling helps?', 'Where would you introduce your main point before giving examples?'],
  },
};
