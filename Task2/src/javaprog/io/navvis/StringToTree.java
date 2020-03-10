package javaprog.io.navvis;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

public class StringToTree {

	public static void main(String[] args) {
		BinaryTree tree = new BinaryTree();
		Node root = null;
		try {
			String reader = null;
			int count = 0;
			BufferedReader read = new BufferedReader(new FileReader("InputFile.txt"));
			HashMap<String, Integer> hm = new HashMap<>();
			while((reader = read.readLine()) != null) {
				String line = reader;
				String[] words = line.split("[\\n\\t ]");
				/*Converting the words array to Hashmap with word as Key and occurrence count as Value*/
				for(String word : words) {
					if(hm.containsKey(word)) {
						count = hm.get(word) + 1;
						hm.put(word, count);
					}
					else
						hm.put(word, 1);
				}
			}
			read.close();
			

			/*
			 * for ( Map.Entry<String, Integer> entry : hm.entrySet()) {
			 * System.out.println(entry.getKey()+" : "+entry.getValue()); }
			 */
			root = tree.buildTree(hm);
			tree.printLevelOrder(root);
			//tree.printInorder(root);
		}
		catch (IOException e) {
			System.out.println("File Input Exception");
		}

	}

}
