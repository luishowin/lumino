export const TUTORS = [
 {id:'linda',name:'Linda',tag:'Clear and structured',hi:'I like things clear and in order.'},
 {id:'charles',name:'Charles',tag:'Relaxed and practical',hi:'I like to keep things relaxed and practical.'}
];
export { starters as LESSONS } from './lessons/index.mjs';
export const TROPHIES = [{d:10,tone:'bronze',name:'Bronze'},{d:30,tone:'silver',name:'Silver'},{d:50,tone:'gold',name:'Gold'},{d:100,tone:'diamond',name:'Diamond'}];
export const RIVALS = [['Amani',140],['Wanjiru',96],['Kip',52],['Zuri',33],['Otieno',12],['Naliaka',6]];

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
